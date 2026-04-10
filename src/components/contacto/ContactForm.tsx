import { useState, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import {
    SECRET_KEY,
    SITE_KEY,
    ENDPOINT,
    EMAIL
} from 'astro:env/client';

declare global {
    interface Window {
        grecaptcha: {
            ready: (callback: () => void) => void;
            execute: (siteKey: string, options: { action: string }) => Promise<string>;
        };
    }
}

interface FormFields {
    name: string;
    phone: string;
    email: string;
    message: string;
    secret_key: string;
    addressee: string;
    asunto: string;
    token?: string;
}

export default function ContactForm() {
    const [isSending, setIsSending] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const resetForm = () => {
        formRef.current?.reset();
    };

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const fields: FormFields = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string,
            secret_key: SECRET_KEY ?? '',
            addressee: EMAIL ?? '',
            asunto: `Contacto desde la web - de: ${formData.get('nombre') as string}`,
        };

        if (!isSending) {
            setIsSending(true);
            window.grecaptcha.ready(function () {
                window.grecaptcha.execute(SITE_KEY ?? '', { action: 'contacto' }).then(function (getToken: string) {
                    fields.token = getToken;
                    sendForm(fields);
                });
            });
        }
    };

    const sendForm = (fields: FormFields) => {
        fetch(ENDPOINT ?? '', {
            method: 'POST',
            body: JSON.stringify(fields),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw err;
                    });
                }
                return response.json();
            })
            .then(() => {
                toast.success('Gracias por consultar, te responderemos a la brevedad');
                resetForm();
            })
            .catch(error => {
                if (error.errors) {
                    const formErrors = error.errors;
                    for (const field in formErrors) {
                        if (formErrors.hasOwnProperty(field)) {
                            toast.warning(formErrors[field]);
                            break;
                        }
                    }
                } else if (error.message) {
                    toast.error(error.message);
                }
            })
            .finally(() => {
                setIsSending(false);
            });
    };

    return (
        <section className="relative bg-white overflow-hidden py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-8 md:px-16">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-0 lg:gap-8 xl:gap-16 items-center">
                    {/* Formulario */}
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 z-10"
                    >
                        <Toaster
                            richColors
                            position="bottom-right"
                            toastOptions={{
                                style: { marginBottom: '60px' },
                            }}
                        />
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre y Apellido"
                            required
                            className="border-2 border-black px-5 py-5 w-full text-sm font-medium italic placeholder:font-medium placeholder:italic placeholder:text-black focus:outline-none bg-transparent"
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Teléfono"
                            className="border-2 border-black px-5 py-3 w-full text-sm font-medium italic placeholder:font-medium placeholder:italic placeholder:text-black focus:outline-none bg-transparent"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            required
                            className="border-2 border-black px-5 py-3 w-full text-sm font-medium italic placeholder:font-medium placeholder:italic placeholder:text-black focus:outline-none bg-transparent"
                        />
                        <textarea
                            name="message"
                            placeholder="Mensaje"
                            rows={5}
                            required
                            className="border-2 border-black px-5 py-4 w-full text-sm font-medium italic placeholder:font-medium placeholder:italic placeholder:text-black focus:outline-none bg-transparent resize-none"
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                type="submit"
                                disabled={isSending}
                                className="px-10 py-3 text-white font-bold tracking-widest uppercase text-xs bg-linear-to-r from-degrade-2 via-degrade-3 to-degrade-3 cursor-pointer transition-opacity duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSending ? 'Enviando...' : 'ENVIAR'}
                            </button>
                        </div>
                    </form>

                    {/* Logo decorativo (solo desktop) */}
                    <div className="flex md:w-120 lg:w-150 xl:w-160 md:relative">
                        <img
                            src="/images/logos/tresvecestres/logo-negro.svg"
                            alt="logo Tres Veces Tres"
                            loading="lazy"
                            aria-hidden="true"
                            className="max-sm:hidden w-full absolute md:-right-8 lg:-right-10 xl:static top-1/2 -translate-y-1/2 xl:translate-y-0 opacity-2 md:opacity-10 pointer-events-none select-none"
                        />
                        <img
                            src="/images/logos/tresvecestres/iso-negro.svg"
                            alt="logo Tres Veces Tres"
                            loading="lazy"
                            aria-hidden="true"
                            className="sm:hidden w-full absolute top-1/2 -translate-y-1/2 opacity-3 pointer-events-none select-none"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
