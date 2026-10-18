(async function bulkDeleteGeminiChats() {
    const config = {
        maxDeletions: 50,
        delay: 600, // Delay to allow animations/menus to load
        deleteMenuOptionSelector: 'button[data-test-id="delete-button"]'
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    const menuIcons = document.querySelectorAll('mat-icon[data-mat-icon-name="more_vert"]');
    const chatMenus = Array.from(menuIcons)
        .map(icon => icon.closest('button'))
        .filter(button => button !== null);

    console.log(`Found ${chatMenus.length} chats to delete.`);

    if (chatMenus.length === 0) {
        console.error("Could not find any chats. Make sure the sidebar is open.");
        return;
    }

    let deletedCount = 0;

    for (let i = 0; i < Math.min(chatMenus.length, config.maxDeletions); i++) {
        try {
            // 1. Open the menu
            chatMenus[i].click();
            await sleep(config.delay);

            // 2. Click the first Delete option
            const deleteBtn = document.querySelector(config.deleteMenuOptionSelector);
            if (deleteBtn) {
                deleteBtn.click();
                await sleep(config.delay);

                // 3. Find and click the final confirmation "Delete" button by its text
                const allSpans = Array.from(document.querySelectorAll('span.gds-body-m'));
                const confirmSpan = allSpans.find(span => span.textContent.trim() === 'Delete');
                
                if (confirmSpan) {
                    const finalConfirmBtn = confirmSpan.closest('button');
                    if (finalConfirmBtn) {
                        finalConfirmBtn.click();
                        deletedCount++;
                        console.log(`Successfully deleted chat ${i + 1}`);
                    }
                } else {
                    console.warn(`Could not find final confirmation button for chat ${i + 1}`);
                }
            } else {
                console.warn(`Could not find Delete option in menu for chat ${i + 1}`);
            }
            
            // Wait for UI to settle before the next iteration
            await sleep(config.delay * 2); 
        } catch (error) {
            console.error(`Error processing chat ${i + 1}:`, error);
        }
    }
    console.log(`Cycle complete. Deleted ${deletedCount} chats.`);
})();
