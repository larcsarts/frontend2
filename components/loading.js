const Loading = () => 
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#1B1C3F"
    }}>
        <div style={{ marginTop: "0" }} className="loading-icon"><div></div><div></div><div></div><div></div></div>
    </div>

export default Loading;