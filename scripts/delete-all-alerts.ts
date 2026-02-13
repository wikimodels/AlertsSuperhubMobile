import { environment } from '../src/environments/environment';

async function deleteAllAlerts() {
    console.log('🗑️  Deleting all existing triggered line alerts...\n');

    try {
        const response = await fetch(`${environment.alertsUrl}/line/triggered/all`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${environment.token}`,
            },
        });

        if (response.ok) {
            const result = await response.json();
            console.log(`✅ Deleted ${result.deletedCount || 0} alerts\n`);
        } else {
            console.error(`❌ Failed to delete: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('❌ Network error:', error);
    }
}

// Run the script
deleteAllAlerts().catch(console.error);
