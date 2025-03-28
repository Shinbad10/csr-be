import { patientService } from "../services/index.js";


export const fetchPatients = async (req, res) => {
  try {
    const result = await patientService.getPatients();
    res.status(200).json({ success: true
      , result:result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const fetchPatientsbyCampaign = async (req, res) => {
  const {MaDotKham} = req.params
  try {
    const patients = await patientService.getPatientsByCampaign(MaDotKham);
    res.status(200).json({ success: true
      , patients:patients
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 

export const insertPatient = async (req, res) => {
  const {patient,dscv} = req.body
  const newPatient = {
    ...patient,
    DangKyMo: false,
    MatPhaiMo:false,
    MatTraiMo:false
  }
  const CongViecThucHien = 
    dscv.map((cv) => {
      return {
        ID_CVTH: patient.MaBenhNhan +'.'+ cv.MaCongViec,
        MaBenhNhan: patient.MaBenhNhan,
        MaCongViec: cv.MaCongViec,
        NVThucHien:0,
        NgayThucHien: null,
        TinhTrang: 0
      }
    })
  try {
    await patientService.insertPatient(newPatient);
    await patientService.insertTaskPatient(CongViecThucHien);
     res.status(200).json({ success: true});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updatePatient = async (req, res) => {
  const body = req.body;
  try {
    if (Array.isArray(body?.updatedData)) {
      await Promise.all(
        body.updatedData.map(async (patient) => {
          await patientService.updatePatient(patient.MaBenhNhan, patient);
        })
      );
    } else {
      await patientService.updatePatient(body.MaBenhNhan, body);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deletePatient = async (req, res) => {
  const rows = req.body
  try {
    await patientService.deletePatient(rows.data);
     res.status(200).json({ success: true});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getDiagnosis = async (req, res) => {
const {MaBenhNhan} = req.query
 try {
    const result = await patientService.getDiagnosis(MaBenhNhan);
    res.json({success:true,result:result});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const saveDiagnosis = async(req,res)=>{
  const {diagnosisPayload,updateTask} = req.body
  try {
      await patientService.saveDiagnosis(diagnosisPayload);
     await patientService.updateCVTH(updateTask.ID_CVTH,updateTask);
    res.status(200).json({ success: true});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

  export const saveConsultation = async(req,res)=>{
    const {consultationPayload,updateTask} = req.body
    try {
        await patientService.updatePatient(updateTask.MaBenhNhan,{DangKyMo:consultationPayload.DangKyMo});
        delete consultationPayload.DangKyMo;
        await patientService.saveConsultation(consultationPayload);
        await patientService.updateCVTH(updateTask.ID_CVTH,updateTask);
      res.status(200).json({ success: true});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

export const savePreScription = async(req,res)=>{
  const {preScriptionPayload,updateTask} = req.body
  try {
      await patientService.savePreScription(preScriptionPayload);
      await patientService.updateCVTH(updateTask.ID_CVTH,updateTask);
    res.status(200).json({ success: true});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}