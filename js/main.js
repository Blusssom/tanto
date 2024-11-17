import { mask } from './mask.js'

// Скрытие начального экрана
const initialScreen = document.querySelector('.initial-screen')
setTimeout(() => {
    initialScreen.classList.add('done')
    // document.body.classList.remove('no-scroll')
}, 2000)

// Форма авторизации
const authorizationForm = initialScreen.querySelector('.authorization-form')
const authorizationFormButton = initialScreen.querySelector('.authorization-form-button')
authorizationFormButton.addEventListener('click', () => {
    if (!authorizationForm.classList.contains('number-entered')) {
        authorizationForm.classList.add('number-entered')
    } else {
        setTimeout(() => {
            document.body.classList.remove('no-scroll')
            initialScreen.classList.add('auth-completed')
        }, 500)
        setTimeout(() => {initialScreen.style.display = 'none'}, 1500)
    }
})

// Маска дял номера телефона
mask('[data-input-type="tel"]')

// Запрет букв в числовых инпутах
document.querySelectorAll('[data-number-input]').forEach(input => {
    input.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '')
    })
})


const createFreeModeSwiper = (selector, space) => {
    const swiper = new Swiper(selector, {
        spaceBetween: space,
        slidesPerView: 'auto',
        freeMode: true,
    });
    return swiper
}

// Свайпер сторис
createFreeModeSwiper('.main-screen-stories', 10)

// Свайпер навигации категорий
createFreeModeSwiper('.categories-nav', 13)

// Переключение вкладок
const navigation = document.getElementById('navigation')
navigation.addEventListener('click', e => {
    const navBtn = e.target.closest('.navigation-item')
    if (navBtn) {
        navigation.querySelector('.navigation-item.active').classList.remove('active')
        navBtn.classList.add('active')
        document.body.setAttribute('data-screen', navBtn.getAttribute('data-screen'))
        document.querySelector('.drag-element.folded')?.classList.remove('folded')
    }
})

const dishCategories = [
    {
        name: 'Пиццы',
        items: [
            {
                name: 'Пицца 1',
                desc: 'Описание пиццы 1 Описание пиццы 1 Описание пиццы 1 Описание пиццы 1 Описание пиццы 1',
                price: 900,
                id: 1,
                image: './images/categories/pizza/1.png',
                count: 1,
            },
            {
                name: 'Пицца 2',
                desc: 'Описание пиццы 2',
                price: 1000,
                id: 2,
                image: './images/categories/pizza/2.png',
                count: 1,
            },
        ]
    },
    {
        name: 'Блюда',
        items: [
            {
                name: 'Блюдо 1',
                desc: 'Описание блюда 1',
                price: 800,
                id: 3,
                image: './images/categories/dishes/1.png',
                count: 1,
            },
            {
                name: 'Блюдо 2',
                desc: 'Описание блюда 2',
                price: 800,
                id: 4,
                image: './images/categories/dishes/2.png',
                count: 1,
            },
            {
                name: 'Блюдо 3',
                desc: 'Описание блюда 3',
                price: 800,
                id: 5,
                image: './images/categories/dishes/3.png',
                count: 1,
            },
            {
                name: 'Блюдо 4',
                desc: 'Описание блюда 4',
                price: 800,
                id: 6,
                image: './images/categories/dishes/4.png',
                count: 1,
            },
        ]
    },
]
const cart = []
let lastOpenedDish

function completeCategories() {
    dishCategories.forEach((category, i) => {
        const categoryHTML = document.querySelector(`[data-category-wrapper='${i+1}']`)
        category.items.forEach(item => {
            categoryHTML.insertAdjacentHTML('beforeend', `
            <div class="category-item ${category.name === 'Пиццы' ? 'category-item--horizontal' : 'category-item--vertical'} d-flex" data-id="${item.id}">
                <div class="category-item-img">
                    <img src="${item.image}" alt="">
                </div>
                <div class="category-item-text-wrapper">
                    <div class="category-item-title">${item.name}</div>
                    ${category.name === 'Пиццы' ? `<div class="category-item-description">${item.desc}</div>` : ''}
                    <div class="category-item-price">${item.price} ₽</div>
                </div>
                <div class="category-item-btn button"></div>
            </div>
            `)
        })
    })
}
completeCategories()

// Выбор категории блюд
const categoriesNav = document.getElementById('categories-nav')
categoriesNav.addEventListener('click', e => {
    if (e.target.classList.contains('categories-nav-item')) {
        if (e.target.getAttribute('data-category') === 'all') {
            document.querySelectorAll('.category-wrapper').forEach(c => {
                c.classList.remove('hidden')
            })
        } else {
            document.querySelectorAll('.category-wrapper').forEach(c => {
                c.classList.add('hidden')
            })
            document.getElementById(`category-${e.target.getAttribute('data-category')}`)?.classList.remove('hidden')
        }
        categoriesNav.querySelector('.categories-nav-item.active').classList.remove('active')
        e.target.classList.add('active')
    }
})

// Открытие блюда
const dishesHTML = document.querySelectorAll('.category-item')
const dishReviewHTML = document.getElementById('dish-review')
const dishReviewTitle = dishReviewHTML.querySelector('.dish-review-title')
const dishReviewDescription = dishReviewHTML.querySelector('.dish-review-description')
const dishReviewAddButton = dishReviewHTML.querySelector('.dish-review-add-button')
const dishReviewImage = dishReviewHTML.querySelector('.dish-review-image img')

dishesHTML.forEach(dish => {
    dish.addEventListener('click', (e) => {
        if (!e.target.classList.contains('category-item-btn')) {
            openDishReview(dish.getAttribute('data-id'))
        } else {
            addToCart(dish.getAttribute('data-id'))
        }
    })
})

function openDishReview(dishId) {
    const dishObj = getDishObjById(dishId)
    completeDishReview(dishObj)
    dishReviewHTML.setAttribute('data-dish-id', dishObj.id)
    dishReviewHTML.classList.add('active')
    document.body.classList.add('no-scroll')
    lastOpenedDish = dishObj
}

function getDishObjById(dishId) {
    const categoryObj = dishCategories.find(category => {
        return category.items.find(item => item.id === +dishId)
    })
    return categoryObj.items.find(item => item.id === +dishId)
}

function completeDishReview(dishObj) {
    dishReviewImage.src = dishObj.image
    dishReviewTitle.innerHTML = dishObj.name
    dishReviewDescription.innerHTML = dishObj.desc
    dishReviewAddButton.innerHTML = `+ ${dishObj.price} ₽`
}

// Добавление в корзину с обзора
dishReviewAddButton.addEventListener('click', () => {
    addToCart(lastOpenedDish.id)
})

// Добавление в корзину
function addToCart(dishId) {
    const dishObj = getDishObjById(dishId)
    if (!cart.find(dish => dish.id === dishObj.id)) {
        cart.push(JSON.parse(JSON.stringify(dishObj)))
        updateCartStatus()
    }
}

// Закрытие попапов
document.querySelectorAll('.popup-close-button').forEach(button => {
    button.addEventListener('click', () => {
        const popup = button.closest('.popup')
        popup.classList.remove('active')
        document.body.classList.remove('no-scroll')
        if (popup.classList.contains('dish-review') && document.querySelector('.cart-screen').classList.contains('active')) {
            document.body.classList.add('no-scroll')
        }
        if (popup.classList.contains('cart-screen')) {
            cartCheckout.classList.remove('active')
            cartCheckout.classList.remove('folded')
            popup.style.paddingBottom = '30px'
        }
    })
})

// Открытие корзины
const cartButton = document.getElementById('cartButton')
const cartScreen = document.getElementById('cartScreen')
cartButton.addEventListener('click', () => {
    if (cartScreen.classList.contains('empty')) cartScreen.classList.remove('empty')
    if (cart.length === 0) cartScreen.classList.add('empty')
    cartScreen.classList.add('active')
    document.body.classList.add('no-scroll')
})

// Обновление состония корзины
const cartProductsWrapper = cartScreen.querySelector('.cart-products')
function updateCartStatus() {
    const dishesCount = cart.reduce((acc, dish) => acc + dish.count, 0)
    cartButton.innerHTML = cart.length
    cartScreen.querySelector('.cart-text').innerHTML = `
        ${dishesCount} товар${dishesCount === 1 ? '' : dishesCount > 1 && dishesCount < 5 ? 'а' : 'ов'} на сумму ${cart.reduce((acc, dish) => acc + dish.price * dish.count, 0)} ₽
        `
    cartProductsWrapper.innerHTML = ''
    cart.forEach(item => {
        cartProductsWrapper.insertAdjacentHTML('beforeend', `
            <div class="cart-product" data-id="${item.id}">
                <div class="cart-product-image">
                    <img src="${item.image}" alt="">
                </div>
                <div class="cart-product-text-wrapper">
                    <div>
                        <div class="cart-product-title">${item.name}</div>
                        <div class="cart-product-description">${item.desc}</div>
                    </div>
                    <div class="cart-product-price">${item.price} ₽</div>
                </div>
                <div class="cart-product-modify-btn button">Изменить</div>
                <div class="cart-product-count">
                    <button type="button" data-type="less">-</button>
                    <div class="cart-product-count-number">${item.count}</div>
                    <button type="button" data-type="more">+</button>
                </div>
            </div>
            `)
    })

    const cartAdditionWrapper = document.getElementById('cartAdditionWrapper')
    cartAdditionWrapper.innerHTML = ''
    dishCategories.forEach(category => {
        category.items.forEach(item => {
            if (!cart.find(dish => dish.id === item.id)) {
                cartAdditionWrapper.insertAdjacentHTML('beforeend', `
                    <div class="swiper-slide cart-addition-item button" data-id="${item.id}">
                        <div class="cart-addition-item-image">
                            <img src="${item.image}" alt="">
                        </div>
                        <div class="cart-addition-item-text">
                            <div>${item.name}</div>
                            <div class="cart-addition-item-price">${item.price} ₽</div>
                        </div>
                    </div>
                    `)
            }
        })
    })
    document.getElementById('cartCheckoutTotalCount').innerHTML = cart.reduce((acc, dish) => acc + dish.count * dish.price, 0)
}

const cartCheckoutOpenButton = cartScreen.querySelector('.cart-main-button')
const cartCheckout = document.getElementById('cartCheckout')

cartScreen.addEventListener('click', (e) => {
    //Открытие обзора блюда с корзины
    if (e.target.classList.contains('cart-product-modify-btn')) {
        openDishReview(e.target.closest('.cart-product').getAttribute('data-id'))
    }
    if (e.target.closest('.cart-addition-item')) {
        openDishReview(e.target.closest('.cart-addition-item').getAttribute('data-id'))
    }

    // Изменение количества блюд
    if (e.target.closest('.cart-product-count') && e.target.hasAttribute('data-type')) {
        const action = e.target.getAttribute('data-type')
        const dishId = +e.target.closest('.cart-product').getAttribute('data-id')
        const currentDishObj = cart.find(dish => dish.id === dishId)
        if (action === 'more') currentDishObj.count += 1
        else currentDishObj.count -= 1
        if (currentDishObj.count === 0) {
            const index = cart.findIndex(dish => dish.id === dishId)
            cart.splice(index, 1)
            if (cart.length === 0) {
                cartScreen.classList.add('empty')
            }
        }
        updateCartStatus()
    }

    // Сворачивание Cart Checkout
    if (!e.target.classList.contains('cart-main-button') && cartCheckout.classList.contains('active')) {
        cartCheckout.classList.remove('active')
        cartCheckout.classList.add('folded')
    }
})

// Свайпер дополнений к заказу
createFreeModeSwiper('.cart-addition-items', 10)

createFreeModeSwiper('.cart-checkout-time-inputs', 9)

// Открытие Drag Element
function showDragElement(el) {
    el.style.display = 'block'
    setTimeout(() => {
        el.classList.remove('folded')
        el.classList.add('active')
    }, 0)
}

// Открытие Cart Checkout
cartCheckoutOpenButton.addEventListener('click', () => {
    cartScreen.style.paddingBottom = '60px'
    showDragElement(cartCheckout)
})

// Сворачивание Drag Element
document.querySelectorAll('.drag-element').forEach(dragElement => {
    const trigger = dragElement.querySelector('.drag-element-trigger')
    let startPosY, endPosY
    trigger.addEventListener('touchstart', (e) => {
        startPosY = e.touches[0].clientY
        dragElement.style.transition = 'none'
    })
    trigger.addEventListener('touchmove', (e) => {
        const currentY = e.touches[0].clientY;
        const diffY = currentY - startPosY;
        dragElement.style.transform = `translateY(${diffY > 0 ? diffY : 0}px)`
        endPosY = currentY
    })
    trigger.addEventListener('touchend', () => {
        dragElement.style.transition = 'transform .3s linear'
        if (startPosY < endPosY) {
            dragElement.classList.remove('active')
            dragElement.classList.add('folded')
        } else if (startPosY > endPosY) {
            dragElement.classList.remove('folded')
            dragElement.classList.add('active')
        }
        dragElement.style = ''
    })
})

// Свайпер карт в профиле
const profileCardsSwiper = createFreeModeSwiper('.profile-cards', 26)

// Открытие вкладки добавления карты
const profileAddCardButton = document.getElementById('profileAddCardButton')
const profileCardAddition = document.getElementById('profileCardAddition')
profileAddCardButton.addEventListener('click', () => { showDragElement(profileCardAddition) })

// Форматирование инпутов в добавлении карты
const cardNumberInput = document.getElementById('cardNumberInput')
const cardDateInput = document.getElementById('cardDateInput')
cardNumberInput.addEventListener('input', () => {
    let value = cardNumberInput.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ');
    cardNumberInput.value = value.trim();
})
cardDateInput.addEventListener('input', () => {
    let value = cardDateInput.value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d{2})/g, '$1/$2');
    value = value.slice(0, 5);
    cardDateInput.value = value;
})

// Добавление карты
document.querySelector('.profile-card-addition-button').addEventListener('click', () => {
    if (cardNumberInput.value.length === 19) {
        profileAddCardButton.closest('.profile-add-card').insertAdjacentHTML('beforebegin', `
        <div class="swiper-slide profile-card">
            <div>${cardNumberInput.value.slice(-4)}</div>
        </div>
        `)
        profileCardsSwiper.update()
        profileCardAddition.querySelectorAll('input').forEach(input => { input.value = '' })
        profileCardAddition.classList.remove('active')
    }
})