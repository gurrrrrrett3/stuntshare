import "../scss/styles.scss"
import * as bootstrap from 'bootstrap'

fetch("/api/v1/home", {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
}).then(res => {

    console.log(res)

    const data = res.json()

    const featuredCarousel = document.getElementById("featuredItems") as HTMLDivElement
    const featuredCarouselIndicators = document.getElementById("featuredIndicators") as HTMLDivElement

    data.then((data: {
        featured: {
            title: string,
            description: string,
            image: string,
        }[],
    }) => {

        data.featured.forEach((item, index) => {
            addCarouselItem(featuredCarousel, featuredCarouselIndicators, {
                ...item,
                active: index === 0,
                index,
                key: "featured",
                target: "featuredCarousel"
            })
        })



    })

})


export function addCarouselItem(root: HTMLDivElement, indicators: HTMLDivElement, {
    title,
    description,
    image,
    active,
    index,
    key
}: {
    title: string,
    description: string,
    image: string,
    active: boolean,
    index: number,
    key: string,
    target: string
}) {

    /*

    <div class="carousel-item active">
                <img src="https://via.placeholder.com/1920x1080" class="d-block w-100" alt="..." id="featured1">
                <div class="carousel-caption d-none d-md-block">
                  <h5>...</h5>
                  <p>...</p>
                </div>
            </div>

    */

    const carouselItem = document.createElement("div")
    carouselItem.classList.add("carousel-item")
    if (active) {
        carouselItem.classList.add("active")
    }

    const img = document.createElement("img")
    img.src = image
    img.classList.add("d-block", "w-100")
    img.alt = title
    img.id = `${key}${index}`

    const carouselCaption = document.createElement("div")
    carouselCaption.classList.add("carousel-caption", "d-none", "d-md-block")

    const h5 = document.createElement("h5")
    h5.innerText = title

    const p = document.createElement("p")
    p.innerText = description

    carouselCaption.appendChild(h5)
    carouselCaption.appendChild(p)

    carouselItem.appendChild(img)
    carouselItem.appendChild(carouselCaption)

    root.appendChild(carouselItem)

    // <button type="button" data-bs-target="#featuredCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
    

    const indicator = document.createElement("button")
    indicator.type = "button"
    indicator.dataset.bsTarget = `#${key}`
    indicator.dataset.bsSlideTo = `${index}`
    indicator.setAttribute("aria-label", `Slide ${index + 1}`)
    if (active) {
        indicator.classList.add("active")
    }

    indicators.appendChild(indicator)

}