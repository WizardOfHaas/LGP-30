/**
 * Global definitions for Window
 */
import * as JQuery from 'jquery';
import { LGP30 } from './src/lgp30'; // <-- Adjust this path as needed

declare global {
    interface Window {
        /** The full jQuery object, typically exposed globally. */
        jQuery: typeof JQuery;
        /** The common alias for the jQuery object. */
        $: typeof JQuery;
        /** The LGP30 class/constructor, exposed globally. */
        LGP30: typeof LGP30;
        /* An instance of LGP30 */
        lgp30: typeof LGP30;
    }
}
