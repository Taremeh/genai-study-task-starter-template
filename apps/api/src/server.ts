import app from './app';
import initializeDb from './db/init';
import { delay } from './utils/delay.utils';

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  console.log(`Waiting to initialize database...`);
  await delay(2000).then(() => {
    console.log(`Initializing database...`);
    initializeDb().catch(err => console.error(err));
  });
});