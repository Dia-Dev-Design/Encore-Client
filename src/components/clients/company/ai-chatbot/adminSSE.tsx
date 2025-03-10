import { useEffect, useState } from 'react';

function adminSSE(userID :any, chatbotID: any, isLawyer: boolean) {
    const [data, setData] = useState(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (userID === undefined || chatbotID === undefined) return;
        const url = isLawyer 
        ? process.env.REACT_APP_API_BASE_URL+`api/chatbot/lawyer-chat/joinChat/lawyer?userId=${userID}&chatId=${chatbotID}`
        : process.env.REACT_APP_API_BASE_URL+`api/chatbot/lawyer-chat/joinChat?userId=${userID}&chatThreadId=${chatbotID}`
        const eventSource = new EventSource(url);

        //   eventSource.onmessage = (event) => {
        //     try {
        //         console.log(`Event data: ${event.data}`);
        //         const newData = JSON.parse(event.data);
        //         setData(newData);
        //     } catch (err) {
        //         console.error('Error al procesar el mensaje SSE:', err);
        //     }
        // };

        eventSource.onerror = () => {
            setError('Connection lost. Trying to reconnect...');
            eventSource.close();
        };

        eventSource.addEventListener('chat', (e) => {
            const newData = e.data;
            setData(newData);
        });

        return () => {eventSource.close();}
    }, [userID, chatbotID]);

    return { data, error };
}

export default adminSSE;