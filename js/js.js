document.addEventListener("DOMContentLoaded", function() {
    let mainSwiperAbout;
    mainSwiperAbout = new Swiper('.main-banner-container', {
        slidesPerView: 1,
        spaceBetween: 15,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        autoplay: {
            delay: 15000,
            disableOnInteraction: false
        },
        loop: true,
        watchSlidesProgress: true,
        navigation: {
            nextEl: ".slide-arrow.next"
        },
        on: {
            slideChange: function () {
                const currentSlide = this.realIndex;
                const totalSlides = this.slides.length;

                // Обновление счетчика слайдов
                document.querySelector('.counter-slide').textContent = `${currentSlide + 1} — ${totalSlides}`;

                // Скрытие всех блоков .main-banner-content-info.title
                const infoBlocks = document.querySelectorAll('.main-banner-content-info .title');
                infoBlocks.forEach((block, index) => {
                    if (index === currentSlide) {
                        block.style.display = 'block';
                    } else {
                        block.style.display = 'none';
                    }
                });
            }
        }
    });

    const initialSlide = mainSwiperAbout.realIndex;
    const infoBlocks = document.querySelectorAll('.main-banner-content-info.title');
    infoBlocks.forEach((block, index) => {
        block.style.display = index === initialSlide ? 'block' : 'none';
    });

    let swiperProduct;
    swiperProduct = new Swiper('.finished-detail-container .flex-element-container.swiper-container',{
        slidesPerView: 2,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 1,
            },
            1024: {
                slidesPerView: 1,
            },
            1280: {

            }
        }
    })

    ymaps.ready(init);

    function init() {
        // Создаем карту.
        var myMap = new ymaps.Map('map', {
            center: [56.81308987504281,53.21166481349181], // Координаты центра карты
            zoom: 17 // Масштаб
        });

        // Создаем метку.
        var myPlacemark = new ymaps.Placemark([56.81308987504281,53.21166481349181], {
            // Параметры метки, например:
            // hintContent: 'Метка'
            balloonContent: 'Зимняя улица, 23А'
        }, {
            // Параметры метки, например:
            // iconLayout: 'default#image',
            // iconImageHref: 'https://example.com/icon.png',
            // iconImageSize: [30, 42],
            // iconImageOffset: [-5, -38]
        });

        // Добавляем метку на карту.
        myMap.geoObjects.add(myPlacemark);
    }

});

