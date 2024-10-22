//КОСТЫЛЬ ДЛЯ РЕШЕНИЯ 100VH
const appHeight = () => {
    const doc = document.documentElement
    doc.style.setProperty('--app-height', `${window.innerHeight}px`)
}
window.addEventListener('resize', appHeight);
appHeight()
//КОСТЫЛЬ ДЛЯ РЕШЕНИЯ 100VH

$(function () {
    "use strict";

    var lock = false;

    var ListLoader = function (wrap, url, append) {

        var listBlock = wrap.find('.ix-list-block');
        var navBlock = wrap.find('.ix-nav-block');

        if (lock) {
            return false;
        }
        lock = true;
        navBlock.find('.ix-show-more').addClass('_loading');

        if (!window.history.state) {
            window.history.replaceState({
                module: "skv",
                url: window.location.href
            }, document.title, window.location.href);
        }

        if (!append) {

            if (url.indexOf('PAGEN') > -1) {
                url = url.replace(/&?PAGEN_1=\d+/g, '');

                console.log(url);

            }

            window.history.pushState({
                module: "skv",
                url: url
            }, document.title, url);
        }

        if (url.indexOf('?') > 0) {
            url += '&'
        } else {
            url += '?'
        }

        console.log(url);

        var req = $.ajax({
            url: url + 'ajax=Y',
            type: 'get',
            dataType: 'html'
        });

        var scrollTo = function (wrap, force) {
            force = force || false;
            var scrollPosition = Math.max(wrap.offset().top - 100, 0);
            if (force || ((scrollPosition < $(document).scrollTop()) || (scrollPosition + 400 > ($(document).scrollTop() + $(window).height())))) {
                $('html, body').animate({
                    scrollTop: scrollPosition
                }, 1000);
            }
        };


        // Пришел ответ
        req.done(function (response) {  /* , textStatus, jqXHR */
            if (response) {
                if (!append) {
                    wrap.html(response);
                    scrollTo(wrap);
                } else {
                    var
                        _html = $(response),
                        products = _html.find('.ix-list-item'),
                        pageNav = _html.find('.ix-nav-block').html();

                    $(products).each(function(index){

                        $(this).addClass("loading-element");
                        listBlock.append($(this));

                    });

                    //listBlock.append(products);
                    navBlock.empty().html(pageNav);

                    setTimeout(function(){
                        $(".loading-element").removeClass("loading-element");
                    }, 2000);

                }

            }
            lock = false;
        });

        // Запрос не удался
        req.fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });

        // В любом случае
        req.always(function () {
            lock = false;
            wrap.find('._loading').removeClass('_loading');
        });


    };


    $(document)
        .on('click', '.ix-show-more-btn', function () {
            var wrap = $(this).closest('.ix-cards-wrap');

            console.log(wrap);

            $(document).trigger('page:load', [wrap, $(this).data("url"), true]);
            return false;
        })
        .on('page:load', function (e, wrap, url, append) {
            ListLoader(wrap, url, append);
        });

});

$(document).ready(function(){

    //ЗАГРУЖАЕМ GSAP КОМПОНЕНТЫ
    gsap.registerPlugin(ScrollTrigger,Draggable,TextPlugin);
    //ЗАГРУЖАЕМ GSAP КОМПОНЕНТЫ

    //ФУНКЦИЯ АНИМАЦИИ ВСЕГО ПО ТАЙМЛАЙНУ
    function createScrollTrigger(triggerElement, timeline) {
        //СБРОСИТЬ ТАЙМЛАЙН ПРИ ПРОКРУТКЕ ВНЕ ПОЛЯ ЗРЕНИЯ, ЗА НИЖНЮЮ ЧАСТЬ ЭКРАНА
        ScrollTrigger.create({
            trigger: triggerElement,
            start: "top bottom",
            /*
            onLeaveBack: () => {
                timeline.progress(0);
                timeline.pause();
            }
            */
        });
        //ВОСПРОИЗВЕДЕНИЕ ТАЙМЛАЙНА ПРИ ПРОКРУТКЕ В ПОЛЕ ЗРЕНИЯ (94% от верхнего края экрана)
        ScrollTrigger.create({
            trigger: triggerElement,
            start: "top 94%",
            onEnter: () => timeline.play()
        });
    }
    //ФУНКЦИЯ АНИМАЦИИ ВСЕГО ПО ТАЙМЛАЙНУ

    //ПОДГОТАВЛИВАЕМ ЭЛЕМЕНТЫ ДЛЯ АНИМАЦИИ, РАЗДЕЛЯЕМ НА СЛОВА И БУКВЫ ОТДЕЛЬНО
    let typeSplit = new SplitType("[text-split]", {
        types: "line, words, chars",
        tagName: "span"
    });

    $("[text-split]").each(function (index) {
        $(this).find(".line").wrap("<span class='line-hide'></span>");
    });
    //ПОДГОТАВЛИВАЕМ ЭЛЕМЕНТЫ ДЛЯ АНИМАЦИИ, РАЗДЕЛЯЕМ НА СЛОВА И БУКВЫ ОТДЕЛЬНО

    //АНИМАЦИЯ ВСПЛЫВАЮЩИЕ СТРОКИ
    $("[lines-slide-up]").each(function (index) {
        let tl = gsap.timeline({
            paused: true
        });
        tl.from($(this).find(".line"), {
            opacity: 0,
            yPercent: 100,
            duration: 0.4,
            ease: "power2.out",
            stagger: {
                amount: 0.4
            }
        });
        createScrollTrigger($(this), tl);
    });
    //АНИМАЦИЯ ВСПЛЫВАЮЩИЕ СТРОКИ

    //АНИМАЦИЯ ВСПЛЫВАЮЩИЕ СЛОВА
    $("[words-slide-up]").each(function (index) {
        let tl = gsap.timeline({
            paused: true
        });
        tl.from($(this).find(".word"), {
            opacity: 0,
            yPercent: 100,
            duration: 0.4,
            ease: "power2.out",
            stagger: {
                amount: 0.4
            }
        });
        createScrollTrigger($(this), tl);
    });
    //АНИМАЦИЯ ВСПЛЫВАЮЩИЕ СЛОВА

    //АНИМАЦИЯ ВСПЛЫВАЮЩИЕ БУКВЫ
    $("[letters-slide-up]").each(function (index) {
        let tl = gsap.timeline({
            paused: true
        });
        tl.from($(this).find(".char"), {
            opacity: 0,
            yPercent: 100,
            duration: 0.75,
            ease: "power2.out",
            stagger: {
                amount: 0.3
            }
        });
        createScrollTrigger($(this), tl);
    });
    //АНИМАЦИЯ ВСПЛЫВАЮЩИЕ БУКВЫ











    //АККОРДИОН
    $("body").on("click", ".faq-list-item", function(){

        if($(this).hasClass("active")){
            $(this).find(".faq-list-item-body").slideUp();
            $(this).removeClass("active");
        }else{
            $(this).find(".faq-list-item-body").slideDown();
            $(this).addClass("active");
        }

        return false;
    });
    //АККОРДИОН


    //ОТКРЫТИЕ ВЫБОРА ФАЙЛА
    $("body").on("click", ".pseudo-file-open-js", function(){
        $(this).parent().find("input").click();
        return false;
    });
    //ОТКРЫТИЕ ВЫБОРА ФАЙЛА

    //ОТКРЫТИЕ ЗАКРЫТИЕ МОБИЛЬНОГО МЕНЮ
    $("body").on("click", ".mobile-menu-open a", function(){

        if($(this).hasClass("active")){
            $(this).removeClass("active");
            $(".header").removeClass("open-menu");
        }else{
            $(this).addClass("active");
            $(".header").addClass("open-menu");
        }

        return false;
    });
    //ОТКРЫТИЕ ЗАКРЫТИЕ МОБИЛЬНОГО МЕНЮ

    //ПЛАВНЫЙ СКРОЛЛ К ЯКОРЮ
    $("body").on("click", ".scrollTo", function(){
        $("html, body").animate({
            scrollTop: ($($(this).attr("href")).offset().top-100) + "px"
        }, {
            duration: 500,
            easing: "swing"
        });
        return false;
    });
    //ПЛАВНЫЙ СКРОЛЛ К ЯКОРЮ

    //КОНТРОЛЬ ВВОДА НОМЕРА ТЕЛЕФОНА
    $("body").on("focus", "#phoneNumber", function(){

        if($(this).val() == ""){

            $(this).val("+7 (");
            $(this).get(0).setSelectionRange(4, 4);

            const element = document.getElementById('phoneNumber');
            const maskOptions = {
                mask: '+{7} (000) 000-00-00'
            };
            const mask = IMask(element, maskOptions);

        }

    });

    $("body").on("blur", "#phoneNumber", function(){

        if($(this).val().length <= 4){
            $(this).val("");
            $(this).removeClass("hovered");
        }

    });
    //КОНТРОЛЬ ВВОДА НОМЕРА ТЕЛЕФОНА

    //ОТКРЫТИЕ БЛОКА С ТЕЛЕФОНАМИ
    $("body").on("click", ".open-phones-block", function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            $(this).parent().find(".numbers-hidden-block").removeClass("active");
        }else{
            $(this).addClass("active");
            $(this).parent().find(".numbers-hidden-block").addClass("active");
        }
        return false;
    });
    //ОТКРЫТИЕ БЛОКА С ТЕЛЕФОНАМИ



    //СЛАЙДЕР ПРОДУКЦИИ НА ГЛАВНОЙ СТРАНИЦЕ
    if($(".products-mobile-slider").length > 0){
        if(window.innerWidth < 768 ) {

            console.log(window.innerWidth);

            $(".products-mobile-slider").each((function () {

                $(this).find(".place-swiper-cont").addClass("swiper-container");
                $(this).find(".place-swiper-wrap").addClass("swiper-wrapper");

                //let nav = $("body").find(".main-page-news-slider-navigation")[0];

                var swiper = new Swiper($(this).find(".swiper-container")[0], {

                    speed: 800,
                    parallax: true,
                    spaceBetween: 0,
                    centeredSlides: false,
                    slidesPerView: 1,
                    /*
                    pagination: {
                        el: nav,
                        type: 'bullets',
                    },
                    breakpoints: {
                        320: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 2,
                        }
                    },
                    */

                })

            }));
        }
    }
    //СЛАЙДЕР ПРОДУКЦИИ НА ГЛАВНОЙ СТРАНИЦЕ

    //СЛАЙДЕР ПАРТНЕРОВ НА ГЛАВНОЙ СТРАНИЦЕ
    if($(".partners-mobile-slider").length > 0){
        if(window.innerWidth < 768 ) {

            console.log(window.innerWidth);

            $(".partners-mobile-slider").each((function () {

                $(this).find(".place-swiper-cont").addClass("swiper-container");
                $(this).find(".place-swiper-wrap").addClass("swiper-wrapper");

                //let nav = $("body").find(".main-page-news-slider-navigation")[0];

                var swiper = new Swiper($(this).find(".swiper-container")[0], {

                    speed: 800,
                    parallax: true,
                    spaceBetween: 0,
                    centeredSlides: false,
                    slidesPerView: 1,
                    /*
                    pagination: {
                        el: nav,
                        type: 'bullets',
                    },
                    breakpoints: {
                        320: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 2,
                        }
                    },
                    */

                })

            }));
        }
    }
    //СЛАЙДЕР ПАРТНЕРОВ НА ГЛАВНОЙ СТРАНИЦЕ

});
