import { Router, type IRouter } from "express";
import healthRouter from "./health";
import eventsRouter from "./events";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(eventsRouter);

export default router;
