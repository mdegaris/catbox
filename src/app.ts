import express from 'express';
import path from 'path';

const PORT = 3000;

import { mainApp, socketServer } from './create-app-objs';

mainApp.use(express.static(path.join(__dirname, 'public')));
mainApp.listen(PORT);
