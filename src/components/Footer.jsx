import { showCredits } from '../utils/swal'

function Footer() {
  return (
    <div id="downElements">
      <div> 2026 LAMIT </div>
      <button onClick={showCredits} id="creditsbtn">CREDITS</button>
      <nav className="socialMedias">
        <a href="https://linktr.ee/lamit.ucsal" target="_blank" rel="noopener noreferrer">
          <img src="/media/icons/link.png" alt="Linktree da LAMIT" />
        </a>
        <a href="https://www.instagram.com/lamit.ucsal" target="_blank" rel="noopener noreferrer">
          <img src="/media/icons/instagram.png" alt="Instagram da LAMIT" />
        </a>
        <a href="https://www.tiktok.com/@lamit.ucsal" target="_blank" rel="noopener noreferrer">
          <img src="/media/icons/tiktokicon.png" alt="TikTok da LAMIT" />
        </a>
        <a href="https://www.linkedin.com/company/lamit-ucsal/" target="_blank" rel="noopener noreferrer">
          <img src="/media/icons/linkedin.png" alt="LinkedIn da LAMIT" />
        </a>
      </nav>
    </div>
  )
}

export default Footer
