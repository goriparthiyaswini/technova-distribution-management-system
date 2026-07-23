// ============================================================================
// EXPRESS TYPE AUGMENTATION
// ----------------------------------------------------------------------------
// Adds req.user to Express's Request type. Defined inline (not imported from
// jwt.util.ts) so this file has zero dependencies and merges reliably.
// ============================================================================

import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email: string;
      };
    }
  }
}