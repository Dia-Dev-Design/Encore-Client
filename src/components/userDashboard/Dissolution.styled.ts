import styled from "styled-components";

export const DissolutionStyledWrapper = styled.section`
    position: relative;
    background-color: #eaedef;
    padding: 20px 60px;
    height: 100dvh;

    .wx-layout.x2-1dzadpy {
        position: unset !important;
        min-height: 75dvh !important;

        .wx-sidebar {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 20;
        }
    }

    .company-info-side {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        z-index: 20;
        background: #fff;
        border: 1px solid #95B2D4;
        height: 100dvh;
        overflow-y: auto;
        width: 90%;
        max-width: 592px;
    }
`;
