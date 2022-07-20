import { app } from './server';

app.listen(process.env.SERVER_PORT || 9001);
