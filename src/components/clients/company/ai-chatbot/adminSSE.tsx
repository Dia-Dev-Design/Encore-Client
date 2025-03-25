import { useEffect, useState } from 'react';

function adminSSE(userID :any, chatbotID: any, isLawyer: boolean) {
    const [data, setData] = useState<string | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (userID === undefined || chatbotID === undefined) return;
        
        // Ensure we use consistent parameter names
        const url = isLawyer 
            ? `${process.env.REACT_APP_API_BASE_URL}api/chatbot/lawyer-chat/joinChat/lawyer?userId=${userID}&chatId=${chatbotID}`
            : `${process.env.REACT_APP_API_BASE_URL}api/chatbot/lawyer-chat/joinChat?userId=${userID}&chatThreadId=${chatbotID}`;
            
        console.log("Connecting to SSE URL:", url);
        const eventSource = new EventSource(url);

        eventSource.onerror = (e) => {
            console.error("SSE Connection error:", e);
            setError('Connection lost. Trying to reconnect...');
            eventSource.close();
        };

        eventSource.addEventListener('chat', (e) => {
            try {
                // Parse the data - it might be a string containing JSON
                let parsedData;
                if (typeof e.data === 'string') {
                    parsedData = e.data;
                } else {
                    parsedData = JSON.stringify(e.data);
                }
                console.log("SSE data received:", parsedData);
                setData(parsedData);
            } catch (err) {
                console.error('Error processing SSE message:', err);
                setError('Error processing message');
            }
        });

        return () => {
            console.log("Closing SSE connection");
            eventSource.close();
        }
    }, [userID, chatbotID]);

    return { data, error };
}

export default adminSSE;