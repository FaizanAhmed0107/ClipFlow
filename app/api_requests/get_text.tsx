export default async function get_text(refid: string) {
    try {
        const response = await fetch(`/api/text/${refid}`, {
            method: 'GET'
        });

        if (response.ok) {
            const result = await response.json();
            return { success: true, data: result.text };
        } else {
            const errorResult = await response.json();
            return { success: false, message: errorResult.message || 'No data found!' };
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: 'Error getting result.', error: error.message };
        } else {
            return { success: false, message: 'Error getting result.', error: String(error) };
        }
    }
}
