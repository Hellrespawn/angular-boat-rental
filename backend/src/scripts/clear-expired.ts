import 'dotenv/config';
import { initSequelize } from '../database';
import { SessionService } from '../services/session.service';

async function checkSession(): Promise<void> {
  try {
    await initSequelize();
    const sessionService = new SessionService();

    const cleared = await sessionService.clearExpiredSessions();

    console.log(`Cleared ${cleared} expired sessions.`);
  } catch (error) {
    console.error(error);
  }

  process.exit();
}

checkSession();
