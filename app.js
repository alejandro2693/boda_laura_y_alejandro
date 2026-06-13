document.addEventListener("DOMContentLoaded", () => {
    
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
    // 4. SCROLL STATE FOR DECORATIONS
    // ==========================================================================
    const handleScroll = () => {
        if (window.scrollY > 50) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    };
    
    // Initial check and event listener
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

});
