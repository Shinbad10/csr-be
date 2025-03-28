import db from "../config/knex.js";

export const getPatients = async () => {
  return await db("BenhNhan")
      .leftJoin("DotKham as DK", "DK.MaDotKham", "BenhNhan.MaDotKham")
      .select("BenhNhan.*","DK.TenDotKham")
     
};

export const getDiagnosis = async (MaBenhNhan) => {
    const DoThiLuc = await db("CongViecThucHien as CVTH")
    .leftJoin("DoThiLuc as DTL", "DTL.ID_CVTH", "CVTH.ID_CVTH")
    .select("CVTH.*", "DTL.*")
    .where("CVTH.MaBenhNhan", MaBenhNhan)
    .andWhere("CVTH.MaCongViec", 1) // Chỉ lấy công việc có MaCongViec = 1
    .first(); // Chỉ lấy một kết quả duy nhất
  
    const KhamMat = await db("CongViecThucHien as CVTH")
    .leftJoin("KhamMat as KM", "KM.ID_CVTH", "CVTH.ID_CVTH")
    .leftJoin("NhanVien as NV", "NV.MaNV", "CVTH.NVThucHien")
    .select("CVTH.*", "KM.*","NV.HoTenNV") // Chỉ lấy ID_CVTH từ CVTH
    .where("CVTH.MaBenhNhan", MaBenhNhan)
    .andWhere("CVTH.MaCongViec", 2)
    .first();
  const ChoThuoc = await db("CongViecThucHien as CVTH")
    .leftJoin("ChoThuoc as CT", "CT.ID_CVTH", "CVTH.ID_CVTH")
    .select("CVTH.*", "CT.*")
    .where("CVTH.MaBenhNhan", MaBenhNhan)
    .andWhere("CVTH.MaCongViec", 3) // Chỉ lấy công việc có MaCongViec = 3
    .first();
  
  const TuVan = await db("CongViecThucHien as CVTH")
    .leftJoin("TuVan as TV", "TV.ID_CVTH", "CVTH.ID_CVTH")
    .leftJoin("BenhNhan as BN", "BN.MaBenhNhan", "CVTH.MaBenhNhan")
    .select("CVTH.*", "TV.*","BN.DangKyMo")
    .where("CVTH.MaBenhNhan", MaBenhNhan)
    .andWhere("CVTH.MaCongViec", 4) // Chỉ lấy công việc có MaCongViec = 4
    .first();
  
  // Trả về kết quả gộp
  return { DoThiLuc, KhamMat, ChoThuoc, TuVan };
  

  }
export const getPatientsByCampaign = async (MaDotKham) => {
  const result =  await db("BenhNhan")
  .leftJoin("DotKham as DK", "DK.MaDotKham", "BenhNhan.MaDotKham")
  .select("BenhNhan.*","DK.TenDotKham")
  .select(
    db.raw(`
      COALESCE(
      (
        SELECT 
        CVTH.ID_CVTH,
        CVTH.MaCongViec,
        CVTH.TinhTrang
        FROM CongViecThucHien CVTH
        WHERE CVTH.MaBenhNhan = BenhNhan.MaBenhNhan
        FOR JSON PATH
      ), '[]'
    ) AS TrangThaiCongViec`))

    .where("BenhNhan.MaDotKham", MaDotKham)

  .orderByRaw("UuTien DESC, GioDangKy ASC, MaBenhNhan"); // Sắp xếp theo UuTien giảm dần, sau đó theo id tăng dần.where("MaDotKham",MaDotKham)
  return result.map((row) => ({
    ...row,
    TrangThaiCongViec: JSON.parse(row.TrangThaiCongViec), // Chuyển từ string JSON thành object
  }));
};
  
export const insertPatient = async (PatientData) => {
    return await db("BenhNhan").insert(PatientData);
}
export const insertTaskPatient = async (TaskPatient) => {
    return await db("CongViecThucHien").insert(TaskPatient);
}
export const updatePatient = async (MaBenhNhan, updatedData) => {
    return await db("BenhNhan").where("MaBenhNhan", MaBenhNhan).update(updatedData);
  };
export const deletePatient = async (rows) => {
    return await db("BenhNhan").delete().where("MaBenhNhan", "in", rows);
};
export const saveDiagnosis = async (data) => {
  const idCVTH = Array.isArray(data.ID_CVTH) ? data.ID_CVTH[0] : data.ID_CVTH;

    return await db.transaction(async (trx) => {
      await trx("KhamMat").where("ID_CVTH", idCVTH).delete()
      return await trx("KhamMat").insert({ ...data, ID_CVTH: idCVTH })
    })
  }
export const saveConsultation = async (data) => {
  const idCVTH = Array.isArray(data.ID_CVTH) ? data.ID_CVTH[0] : data.ID_CVTH;

  return await db.transaction(async (trx) => {
    await trx("TuVan").where("ID_CVTH", idCVTH).delete()
    return await trx("TuVan").insert({ ...data, ID_CVTH: idCVTH })
  })
}
export const savePreScription = async (data) => {
  const idCVTH = Array.isArray(data.ID_CVTH) ? data.ID_CVTH[0] : data.ID_CVTH;

  return await db.transaction(async (trx) => {
    const newData = { ...data }
    delete newData.medications
    await trx("ChoThuoc").where("ID_CVTH", idCVTH).delete()
    return await trx("ChoThuoc").insert({ ...newData, ID_CVTH: idCVTH })
  })
}
export const updateCVTH = async (ID_CVTH, updatedData)  => {
    return await db("CongViecThucHien").where("ID_CVTH", ID_CVTH).update(updatedData);
};
  