import express from "express";
import { patientController } from "../controllers/index.js";

const router = express.Router();

router.get("/", patientController.fetchPatients);
router.post("/them-benh-nhan", patientController.insertPatient);
router.post("/sua-benh-nhan", patientController.updatePatient);
router.post("/xoa-benh-nhan", patientController.deletePatient);
router.get("/kham-mat", patientController.getDiagnosis);
router.post("/kham-mat/luu-ket-qua", patientController.saveDiagnosis);
router.post("/tu-van/luu-ket-qua", patientController.saveConsultation);
router.post("/cho-thuoc/luu-ket-qua", patientController.savePreScription);
router.get("/:MaDotKham", patientController.fetchPatientsbyCampaign);


export default router;
