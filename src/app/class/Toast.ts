import Swal from 'sweetalert2';

export class Toast {
    static success(message: string, params?: string) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `${message} ${params}`,
            showConfirmButton: false,
            timer: 1500,
        });
    }

    static error(message: string, params?: string) {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `${message} ${params}`,
            showConfirmButton: false,
            timer: 5000,
        });
    }
}
