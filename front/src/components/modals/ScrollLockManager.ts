// ScrollLockManager to handle body scroll when modal is open
export const scrollLockManager = {
  originalStyle: "",
  lockCount: 0,

  // Lock the scroll - but don't actually lock it
  lock: () => {
    // We're intentionally not locking scroll
    // This prevents the body from becoming unscrollable
    scrollLockManager.lockCount++;
  },

  // Unlock the scroll
  unlock: () => {
    if (scrollLockManager.lockCount > 0) {
      scrollLockManager.lockCount--;
    }
  },

  // Force unlock all (emergency reset)
  forceUnlock: () => {
    scrollLockManager.lockCount = 0;
    // Ensure body overflow is restored
    document.body.style.overflow = "auto";
  },
};
