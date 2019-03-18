import { Router, Request, Response } from 'express';
const router: Router = Router();

let route_version = 1;

router.get('/', (req: Request, res: Response) => {
    res.send(`This is version ${route_version}`);
});

module.exports = router;