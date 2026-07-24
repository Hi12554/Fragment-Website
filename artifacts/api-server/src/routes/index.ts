import { Router, type IRouter } from "express";
import healthRouter from "./health";
import publicConfigRouter from "./publicConfig";
import adminLoginRouter from "./adminLogin";
import adminConfigRouter from "./adminConfig";

const router: IRouter = Router();

router.use(healthRouter);
router.use(publicConfigRouter);
router.use(adminLoginRouter);
router.use(adminConfigRouter);

export default router;
