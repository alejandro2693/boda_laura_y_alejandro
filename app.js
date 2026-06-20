document.addEventListener("DOMContentLoaded", () => {
    
    // Force scroll to top on reload
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // ==========================================================================
    // 1. COUNTDOWN TIMER
    // ==========================================================================
    // Target Date: 19 de Septiembre de 2026, 18:00:00 (Canary Islands local time is UTC+1 during DST)
    const targetDate = new Date("September 19, 2026 18:00:00").getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            document.getElementById("countdown").innerHTML = "<div class='time-block' style='width: 100%;'><span class='time-val'>¡Ha llegado el día!</span></div>";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    };

    // Initial call and set interval
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ==========================================================================
    // 2. COPY IBAN TO CLIPBOARD
    // ==========================================================================
    const copyButton = document.getElementById("btn-copy-iban");
    const ibanText = document.getElementById("iban-value").innerText;
    const copyText = document.getElementById("copy-text");

    copyButton.addEventListener("click", () => {
        // Strip spaces from IBAN for actual copying, but keep clean text
        const cleanIban = ibanText.replace(/\s+/g, '');
        
        navigator.clipboard.writeText(cleanIban).then(() => {
            copyText.innerText = "¡Copiado con éxito!";
            copyButton.classList.add("copied");

            // Reset after 3 seconds
            setTimeout(() => {
                copyText.innerText = "Copiar IBAN";
                copyButton.classList.remove("copied");
            }, 3000);
        }).catch(err => {
            console.error("No se pudo copiar el texto: ", err);
            // Fallback for older browsers or situations where clipboard API fails
            const textarea = document.createElement("textarea");
            textarea.value = cleanIban;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand("copy");
                copyText.innerText = "¡Copiado con éxito!";
                copyButton.classList.add("copied");
                setTimeout(() => {
                    copyText.innerText = "Copiar IBAN";
                    copyButton.classList.remove("copied");
                }, 3000);
            } catch (fallbackErr) {
                copyText.innerText = "Error al copiar";
            }
            document.body.removeChild(textarea);
        });
    });

    // ==========================================================================
    // 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ==========================================================================
    const fadeElements = document.querySelectorAll(".fade-in");
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add("appear");
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // ==========================================================================
    // 4. SCROLL STATE FOR DECORATIONS & SCROLL INDICATOR
    // ==========================================================================
    const scrollIndicator = document.getElementById('scrollIndicator');
    
    const handleScroll = () => {
        const scrollPos = window.scrollY;
        
        // Body scrolled state
        if (scrollPos > 50) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
        
        // Scroll indicator dynamic states
        if (scrollIndicator) {
            const hero = document.querySelector('.section-hero');
            const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
            
            // Fixed state when scrolling past 40% of hero
            if (scrollPos > heroHeight * 0.4) {
                scrollIndicator.classList.add('fixed-scroll');
            } else {
                scrollIndicator.classList.remove('fixed-scroll');
            }
            
            // Hide near the bottom
            const docHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            if (scrollPos + windowHeight >= docHeight - 100) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        }
    };
    
    // Initial check and event listener
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ==========================================================================
    // 5. BACKGROUND MUSIC
    // ==========================================================================
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = musicToggle ? musicToggle.querySelector('.music-icon') : null;
    let isPlaying = false;
    let hasInteracted = false;

    if (bgMusic && musicToggle) {
        // Fallback para navegadores normales (iOS ignorará esto)
        bgMusic.volume = 0.15;

        const toggleMusic = () => {
            if (isPlaying) {
                bgMusic.pause();
                musicToggle.classList.remove('playing');
                isPlaying = false;
            } else {
                bgMusic.play().then(() => {
                    musicToggle.classList.add('playing');
                    isPlaying = true;
                }).catch(e => {
                    console.log("Audio play failed:", e);
                });
            }
        };

        musicToggle.addEventListener('click', () => {
            hasInteracted = true;
            toggleMusic();
        });

        // Attempt to play on first interaction (click/touch/scroll)
        const playOnInteraction = () => {
            if (!hasInteracted && !isPlaying) {
                const playPromise = bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        musicToggle.classList.add('playing');
                        isPlaying = true;
                        hasInteracted = true;
                        
                        // Solo cuando se haya reproducido con éxito quitamos los listeners
                        document.removeEventListener('click', playOnInteraction);
                        document.removeEventListener('touchstart', playOnInteraction);
                        window.removeEventListener('scroll', playOnInteraction);
                    }).catch(e => {
                        // Si falla (por ejemplo, el scroll no cuenta como interacción válida en Chrome/Safari),
                        // NO quitamos los listeners para que el siguiente click sí funcione.
                        console.log("Esperando interacción válida para autoplay:", e);
                    });
                }
            }
        };

        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
        window.addEventListener('scroll', playOnInteraction, { passive: true });
    }
    // ==========================================================================
    // 5. ENVELOPE ANIMATION & WELCOME
    // ==========================================================================
    const envelopeOverlay = document.getElementById('envelopeOverlay');
    const envelopeFlap = document.getElementById('envelopeFlap');
    const btnOpenEnvelope = document.getElementById('btnOpenEnvelope');
    
    if (envelopeOverlay && btnOpenEnvelope) {
        // Block scroll initially
        document.body.classList.add('no-scroll');
        
        btnOpenEnvelope.addEventListener('click', () => {
            // Start envelope animation
            envelopeFlap.classList.add('opened');
            
            // Fade out overlay after flap opens
            setTimeout(() => {
                envelopeOverlay.classList.add('opened');
                // Remove scroll block
                document.body.classList.remove('no-scroll');
            }, 800); // Wait for flap animation to almost finish
            
            // Play music automatically since user interacted
            if (bgMusic && !isPlaying) {
                const playPromise = bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        musicToggle.classList.add('playing');
                        isPlaying = true;
                        hasInteracted = true;
                    }).catch(e => console.log("Autoplay failed:", e));
                }
            }
            hasInteracted = true;
        });
    }

    // ==========================================================================
    // 6. KIDS MENU TOGGLE
    // ==========================================================================
    const btnKidsMenu = document.getElementById('btnKidsMenu');
    const kidsMenuContent = document.getElementById('kidsMenuContent');

    if (btnKidsMenu && kidsMenuContent) {
        btnKidsMenu.addEventListener('click', () => {
            btnKidsMenu.classList.toggle('active');
            kidsMenuContent.classList.toggle('expanded');
        });
    }

    // ==========================================================================
    // 6.5. TRANSPORT INFO TOGGLE
    // ==========================================================================
    const btnTransportInfo = document.getElementById('btnTransportInfo');
    const transportContent = document.getElementById('transportContent');

    if (btnTransportInfo && transportContent) {
        btnTransportInfo.addEventListener('click', () => {
            btnTransportInfo.classList.toggle('active');
            transportContent.classList.toggle('expanded');
        });
    }

    // ==========================================================================
    // 7. COPIAR IBAN
    // ==========================================================================
    const btnCopyIban = document.getElementById('btn-copy-iban');
    const ibanValue = document.getElementById('iban-value');
    const spanCopyText = document.getElementById('copy-text');

    if (btnCopyIban && ibanValue && spanCopyText) {
        btnCopyIban.addEventListener('click', () => {
            const txtIBAN = ibanValue.innerText.trim();
            navigator.clipboard.writeText(txtIBAN).then(() => {
                const originalText = spanCopyText.innerText;
                spanCopyText.innerText = '¡Copiado!';
                btnCopyIban.style.backgroundColor = 'var(--color-primary)';
                btnCopyIban.style.color = 'white';
                
                setTimeout(() => {
                    spanCopyText.innerText = originalText;
                    btnCopyIban.style.backgroundColor = '';
                    btnCopyIban.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('Error al copiar: ', err);
            });
        });
    }

    // ==========================================================================
    // 8. SECONDARY RSVP BUTTON
    // ==========================================================================
    const rsvpSection = document.querySelector('.rsvp-card');
    const floatingRsvp = document.getElementById('floatingRsvp');

    if (rsvpSection && floatingRsvp) {
        const checkScroll = () => {
            const rect = rsvpSection.getBoundingClientRect();
            // If the bottom of the RSVP card goes above the top of viewport
            if (rect.bottom < 0) {
                floatingRsvp.classList.add('show');
            } else {
                floatingRsvp.classList.remove('show');
            }
        };

        window.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();
    }

});
