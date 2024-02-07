export function Marker({text, onClick, isShowText}: any) {
        return (
            <>
                <div className={'marker-wrapper'}>
                    <div
                        className={'pin2'}
                        data-testid={'marker-btn'}
                        onClick={onClick}
                    >
                        {isShowText ?
                            <div className={'marker-text'} data-testid={'marker-test'}>{text}</div>
                            : <div></div>}
                    </div>

                </div>
            </>
        )

}

export default Marker;