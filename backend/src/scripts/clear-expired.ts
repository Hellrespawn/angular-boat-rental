import 'dotenv/config';
import { initSequelize } from '../database';
import { SessionService } from '../services/session.service';

async function checkSession(): Promise<void> {
  try {
    initSequelize();

    const sessionService = SessionService.getInstance();

    const cleared = await sessionService.clearExpiredSessions();

    console.log(`Cleared ${cleared} expired sessions.`);
  } catch (error) {
    console.error(error);
  }

  process.exit();
}

void checkSession();
