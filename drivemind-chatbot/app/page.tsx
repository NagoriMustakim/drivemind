/**
 * Service info page (scaffold). The real value of this app is its API
 * (/session, /query in T031/T032) and the embeddable widget bundle (T033).
 */
export default function Home() {
  return (
    <main style={{ padding: "2rem", maxWidth: 640, margin: "0 auto" }}>
      <h1>DriveMind Chatbot</h1>
      <p>
        This service powers Otto. It exposes <code>POST /session</code> and <code>POST /query</code>{" "}
        and serves the embeddable widget bundle. There is no public UI here.
      </p>
    </main>
  );
}
