import React, { useEffect } from "react";
import * as S from './styles';

const GoogleRedirectHandler: React.FC = () => {
    useEffect(() => {
        const handleToken = () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");

            if (token) {
                const item = {
                    value: token,
                    expiry: 32100000, // 6 hours
                };
                
                window.localStorage.setItem("token", JSON.stringify(item));

                if (window.opener) {
                    window.opener.postMessage(
                        { status: "success", token },
                        window.location.origin
                    );
                    window.close();
                }
            } else {
                console.error("The token was not found in the URL.");
                window.close();
            }
        };

        handleToken();
        setInterval(() => {
            window.close();
        }, 2000);
    }, []);

    return <S.Container><S.Title>You can close this page now</S.Title></S.Container>;
};

export default GoogleRedirectHandler;
