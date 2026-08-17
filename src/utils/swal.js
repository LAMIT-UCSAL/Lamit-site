import Swal from 'sweetalert2'

export function showCredits() {
  Swal.fire({
    position: 'center',
    title: 'CREDITS',
    html: `
      <div>Web Development by Guilherme Mota<br>
      Web Designer by Guilherme Mota<br>
      Pictures by Mike FILLIPPOV</div>
    `,
    color: '#fff',
    background: 'black',
    backdrop: 'black',
    confirmButtonText: '',
    customClass: {
      confirmButton: 'swal-confirmBtn',
      title: 'swal-title',
      htmlContainer: 'swal-html',
      container: 'swal-container'
    }
  })
}

export function copiarTexto(conteudo) {
  navigator.clipboard.writeText(conteudo).then(() => {
    Swal.fire({
      position: 'center',
      icon: 'info',
      iconColor: 'white',
      color: '#fff',
      text: 'O endereço foi copiado',
      background: 'rgba(0, 0, 0, 0)'
    })
  })
}

export function showError(text) {
  Swal.fire({
    position: 'center',
    icon: 'error',
    iconColor: 'white',
    color: '#fff',
    text,
    background: 'rgba(0, 0, 0, 0)',
    backdrop: 'rgba(0, 0, 0, 0.85)',
    customClass: {
      confirmButton: 'swal2-confirm'
    }
  })
}

export function showSuccess(text) {
  return Swal.fire({
    position: 'center',
    icon: 'success',
    color: '#fff',
    text,
    background: 'rgba(0, 0, 0, 0)',
    backdrop: 'rgba(0, 0, 0, 0.85)'
  })
}
