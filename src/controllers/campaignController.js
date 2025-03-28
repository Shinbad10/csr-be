import { campaignService, employeeService, medicineService } from "../services/index.js";

export const fetchCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignService.getCampaigns();
    const employees = await employeeService.getEmployees();
    const medicines = await medicineService.getMedicines();
    const tasks = await campaignService.getTasks();
    res.json({ campaigns, employees,tasks,medicines });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const insertCampaign = async (req, res) => {
  const { campaignData, members, tasks,medicineRows } = req.body; 
  try {
    await campaignService.insertCampaign(campaignData);
    if (members && members.length > 0) {
      const memberList = members.map((MaNV) => ({
        MaDotKham: campaignData.MaDotKham,
        MaNV: MaNV,
      }));
      await campaignService.insertMembers(memberList);
    }
    if (tasks && tasks.length > 0) {
      const taskList = tasks.map((MaCongViec) => ({
        MaDotKham: campaignData.MaDotKham,
        MaCongViec: MaCongViec,
      }));
      await campaignService.insertTasks(taskList);
    }
    if (medicineRows && medicineRows.length > 0) {
      const medicinesUse = medicineRows.map((MDC) => ({
        MaDotKham: campaignData.MaDotKham,
        ...MDC
      }));
      await campaignService.insertMedicines(medicinesUse);
    }
    res.status(200).json({ success: true});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export const updateCampaign = async (req, res) => {
  const { campaignData, members, tasks,medicineRows } = req.body;
  try {
    await campaignService.updateCampaign(campaignData.MaDotKham, campaignData);
    const memberList = members.map((MaNV) => ({
      MaDotKham: campaignData.MaDotKham,
      MaNV: MaNV,
    }));
    await campaignService.updateMembers(campaignData.MaDotKham, memberList);
    const taskList = tasks.map((MaCongViec) => ({
      MaDotKham: campaignData.MaDotKham,
      MaCongViec: MaCongViec,
    }));
    const medicinesUse = medicineRows.map(({ id, TenThuoc, ...rest }) => ({
      MaDotKham: campaignData.MaDotKham,
      ...rest
    }));
    
    delete medicinesUse.TenThuoc
    await campaignService.updateMedicines(campaignData.MaDotKham, medicinesUse);
    await campaignService.updateTasks(campaignData.MaDotKham, taskList);
    res.status(200).json({ success: true});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export const deleteCampaign = async (req, res) => {
  const rows = req.body
  try {
    const result = await campaignService.deleteCampaign(rows.data);
    res.status(200).json({ success: true});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export const campaignDetails = async (req, res) => {
  const {MaDotKham} = req.params
  try {
    const DotKham = await campaignService.getDetailCampaign(MaDotKham);
    const ChanDoan = await campaignService.getChanDoan();
   res.status(200).json({ success: true
    , DotKham:DotKham[0]
     ,ChanDoan:ChanDoan
  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


