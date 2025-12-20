/**
 * Global definitions for Window
 */

import { LGP30 } from './src/lgp30'; // <-- Adjust this path as needed

declare global {
    interface Window {
        /** The LGP30 class/constructor, exposed globally. */
        LGP30: typeof LGP30;
        /* An instance of LGP30 */
        lgp30: typeof LGP30;
    }
}
