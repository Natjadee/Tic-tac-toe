function handleCredentialResponse(response) {
    const userInfo = JSON.parse(atob(response.credential.split('.')[1]));
    userName = userInfo.name;
    // document.getElementById("welcome").innerText = `Welcome, ${userName}`;

    // บันทึกข้อมูลผู้ใช้ลง localStorage
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userName', userName);

    // แสดงหน้าเกมหลังจากเข้าสู่ระบบ
    document.getElementById("login-section").classList.add("hidden");
    // document.getElementById("game-container").style.display = "block"; // แสดงหน้าเกม
    // loadScore();

    // ไปที่หน้า index.html หลังจากเข้าสู่ระบบ
    window.location.href = 'index.html';
}



function initGoogleLogin() {
    google.accounts.id.initialize({
        client_id: "457375752880-u46a6rbl7hff01il2i7ivfbn5ctf18n5.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("google-login-button"), {
            theme: "outline",
            size: "large"
        }
    );
    google.accounts.id.prompt();
}