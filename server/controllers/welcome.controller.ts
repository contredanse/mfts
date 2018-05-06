import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

router.get('/:name', (req: Request, res: Response) => {
    const { name } = req.params;

    res.send(`Hello, ${name}!`);
});

export const WelcomeController: Router = router;
