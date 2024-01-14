window.addEventListener('DOMContentLoaded', () => {
  initAdaptive();

  initMenu();
  initModals();
  initSliders();
  initSilentImages();

  updateWindowHeight();
  updateHeaderHeight();

  // Sliders
  function initSliders() {
    const promotionsSlider = document.querySelector('.promotions__slider');
    const gallerySlider = document.querySelector('.gallery__slider');
    const breakpoint = 768;

    if (promotionsSlider) {
      const options = {
        perPage: 3,
        gap: 75,
        type: 'loop',
        arrows: false,
        speed: 1000,
        focus  : 0,
        breakpoints: {
          1279: {
            perPage: 2,
          },
          1440: {
            gap: 45
          }
        },
      };

      initOnDesktop(promotionsSlider, options);
    }
    if (gallerySlider) {
      const options = {
        perPage: 3,
        gap: 25,
        type: 'loop',
        arrows: false,
        speed: 1000,
        focus  : 0,
        breakpoints: {
          1024: {
            perPage: 2,
          },
        },
      };

      initOnDesktop(gallerySlider, options)
    }

    function initOnDesktop(slider, options) {
      const splide = new Splide(slider, options);

      splide.on( 'pagination:updated', function ( data, prev, curr ) {
        data.items.forEach( function ( item, index ) {
          if (item.page > curr.page) {
            item.li.classList.remove('is-filled');
          } else {
            item.li.classList.add('is-filled');
          }
        } );
      } );

      function toggleSlider() {
        const track = slider.firstElementChild;
        const list = track.firstElementChild;
        const items = [...list.children];

        if ( window.innerWidth > breakpoint && !slider.classList.contains('splide')) {
          slider.classList.add('splide');
          track.classList.add('splide__track');
          list.classList.add('splide__list');
          items.forEach(item => item.classList.add('splide__slide'));

          splide.mount();
        } else if (
          window.innerWidth <= breakpoint &&
          slider.classList.contains('splide')
        ) {
          splide.destroy();

          slider.classList.remove('splide');
          track.classList.remove('splide__track');
          list.classList.remove('splide__list');
          items.forEach(item => item.classList.remove('splide__slide'));
        }
      }

      toggleSlider();

      window.addEventListener('resize', throttle(toggleSlider));
    }
  }

  // Adaptive
  function initAdaptive() {
    moveElementOnBreakpoint(
      '.header__info-address',
      { fromSelector: '.header__info', fromPosition: 'beforeend' },
      { toSelector: '.header__phone-wrapper', toPosition: 'beforeend' },
      1024
    );
    moveElementOnBreakpoint(
      '.header__info-schedule',
      { fromSelector: '.header__info', fromPosition: 'afterbegin' },
      { toSelector: '.header-form', toPosition: 'beforebegin' },
      1024
    );
    moveElementOnBreakpoint(
      '.header__benefits',
      { fromSelector: '.header__body', fromPosition: 'afterend' },
      { toSelector: '.header__form', toPosition: 'afterend' },
      1024
    );
    moveElementOnBreakpoint(
      '.about__img',
      { fromSelector: '.about__inner', fromPosition: 'afterbegin' },
      { toSelector: '.about__left', toPosition: 'beforeend' },
      1024
    );
    moveElementOnBreakpoint(
      '.lead__caption',
      { fromSelector: '.lead__text', fromPosition: 'afterend' },
      { toSelector: '.lead__text-socials ul', toPosition: 'beforebegin' },
      768
    );
    moveElementOnBreakpoint(
      '.about__info-footer p:nth-child(2)',
      { fromSelector: '.about__info-footer', fromPosition: 'beforeend' },
      { toSelector: '.about__row', toPosition: 'afterend' },
      1024
    );
    moveElementBetweenBreakpoints(
      '.about__logo-wrapper',
      { fromSelector: '.about__left', fromPosition: 'afterbegin' },
      { toSelector: '.about__right', toPosition: 'afterbegin' },
      1024,
      768
    );
    moveElementOnBreakpoint(
      '.about__content > p',
      { fromSelector: '.about__row', fromPosition: 'afterend' },
      { toSelector: '.about__info-footer', toPosition: 'beforeend' },
      768
    );
    moveElementOnBreakpoint(
      '.about__info-footer p:nth-child(2)',
      { fromSelector: '.about__info-footer', fromPosition: 'beforeend' },
      { toSelector: '.about__row', toPosition: 'afterend' },
      650
    );
    moveElementOnBreakpoint(
      '.about__logo-wrapper',
      { fromSelector: '.about__left', fromPosition: 'afterbegin' },
      { toSelector: '.about__content', toPosition: 'beforeend' },
      470
    );
    moveElementOnBreakpoint(
      '.footer__copy',
      { fromSelector: '.footer__info', fromPosition: 'beforeend' },
      { toSelector: '.footer__inner', toPosition: 'beforeend' },
      1279
    );
    moveElementOnBreakpoint(
      '.footer__contacts-socials',
      { fromSelector: '.footer__contacts-item:first-child', fromPosition: 'beforeend' },
      { toSelector: '.footer__logo', toPosition: 'afterend' },
      1279
    );
  }

  // Menu
  function initMenu() {
    const header = document.querySelector('.header');

    const menu = new Menu({
      menu: document.querySelector('.header__menu'),
      burger: document.querySelector('.header__burger'),
      navLinks: document.querySelectorAll('.header__nav a'),
      burgerCaption: 'Открыть меню',
      burgerActiveCaption: 'Закрыть меню',
      transitionDelay: 400,
      breakpoint: 1279,
      display: 'flex',
      disableScroll: false,
      onOpen: () => {
        document.querySelector('.header').classList.add('is-active')
      },
      onClose: () => {
        document.querySelector('.header').classList.remove('is-active')
      }
    });

    document.body.addEventListener('click', (e) => {
      if (!e.target.closest('.header__menu')) menu.close();
    })

    window.menu = menu;
  }

  // Modals
  function initModals() {
    const options = {
      transitionDelay: 350,
      onOpen: () => {
        document.querySelector('.page-wrapper').ariaHidden = true;
        window.menu.close();
      },
      onClose: () => {
        document.querySelector('.page-wrapper').ariaHidden = false;
      },
    };

    window.SimpleModal = new SimpleModal(options);
    window.SimpleModal.init();
  }

  // Before & After in silent section
  function initSilentImages() {
    const silentImages = document.querySelector('.silent__images');

    if (!silentImages) return;

    const image = document.querySelector('.silent__img--before');
    const dragItem = interact(document.querySelector('.silent__drag'));
    const dragLine = document.querySelector('.silent__drag-line');
    const btnBefore = document.querySelector('.silent__arrow--before');
    const btnAfter = document.querySelector('.silent__arrow--after');
    const minValue = 0;
    const maxValue = 100;

    dragItem.draggable({
    origin: 'self',
    modifiers: [
      interact.modifiers.restrict({
        restriction: 'self'
      }),
    ],
    listeners: {
      move (event) {
        const sliderWidth = interact.getElementRect(image).width
        const value = (event.pageX / sliderWidth);
				let percent = value * 100;

				if ((value * 100) >= maxValue) {
					percent = maxValue;
					return;
				} else if ((value * 100) <= minValue) {
					percent = minValue;
					return;
				}

				setDragStyles(percent);
      }
    }
  })

	btnBefore.addEventListener('click', () => setDragStyles(maxValue));
	btnAfter.addEventListener('click', () => setDragStyles(minValue));

	function setDragStyles(percent) {
		dragLine.style.left = percent + '%';
		image.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0% 100%)`;
	}

  }
})
