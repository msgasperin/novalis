<?php
if (isset($_SESSION["login_akuris"]) && $_SESSION["login_akuris"] === "SI") {

    // ── Protección contra session hijacking ──────────────────────────────

    $agente_actual   = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $agente_guardado = $_SESSION['_agente'] ?? null;

    // Primera carga tras login — guardar huella del navegador
    if ($agente_guardado === null) {
        $_SESSION['_agente'] = $agente_actual;
        $agente_guardado     = $agente_actual;
    }

    // Si cambia el navegador durante la sesión, cerrarla
    if ($agente_guardado !== $agente_actual) {
        header('Location: ../inicio?cliente_masg='.$_SESSION["cliente_masg"]);
        session_destroy();
        exit;
    }

    // ── Regeneración periódica del ID de sesión (cada 5 min) ─────────────
    if (!isset($_SESSION['_last_regen'])) {
        $_SESSION['_last_regen'] = time();
    }

    if (time() - $_SESSION['_last_regen'] > 300) {
        session_regenerate_id(true);
        $_SESSION['_last_regen'] = time();
    }

    // ── Token de sesión rotativo ─────────────────────────────────────────
    if (!isset($_SESSION['_token'])) {
        $_SESSION['_token'] = bin2hex(random_bytes(16));
    }

    /*
     * Cuando se pueda garantizar la IP real del cliente
     * (sin proxies, sin IP dinámica, sin Cloudflare, etc.)
     * descomentar este bloque y eliminar la validación solo de agente:
     *
     * $ip_actual   = $_SERVER['REMOTE_ADDR'] ?? '';
     * $ip_guardada = $_SESSION['_ip'] ?? null;
     *
     * if ($ip_guardada === null) {
     *     $_SESSION['_ip']     = $ip_actual;
     *     $_SESSION['_agente'] = $agente_actual;
     * }
     *
     * if ($ip_guardada !== $ip_actual || $agente_guardado !== $agente_actual) {
     *     session_destroy();
     *     header('Location: ../index.php');
     *     exit;
     * }
     */

} else {
    header('Location: ../inicio?cliente_masg='.$_SESSION["cliente_masg"]);
    exit;
}