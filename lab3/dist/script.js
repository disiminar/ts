"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class CatalogApp {
    constructor() {
        const categoriesContainer = document.getElementById('categories-list');
        const contentContainer = document.getElementById('category-content');
        if (!categoriesContainer || !contentContainer) {
            throw new Error('Не знайдено необхідні контейнери DOM');
        }
        this.categoriesContainer = categoriesContainer;
        this.contentContainer = contentContainer;
        this.initEventListeners();
        this.loadCategories();
    }
    initEventListeners() {
        const homeLink = document.getElementById('home-link');
        const catalogLink = document.getElementById('catalog-link');
        this.addLinkListener(homeLink);
        this.addLinkListener(catalogLink);
    }
    addLinkListener(link) {
        if (link) {
            link.addEventListener('click', this.handleLinkClick.bind(this));
        }
    }
    handleLinkClick(e) {
        e.preventDefault();
        this.loadCategories();
    }
    loadCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Завантаження категорій');
                const response = yield fetch('../src/data/categories.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = yield response.json();
                console.log('Отримані категорії:', data);
                this.renderCategories(data.categories);
            }
            catch (error) {
                console.error('Помилка завантаження категорій:', error);
            }
        });
    }
    renderCategories(categories) {
        this.categoriesContainer.innerHTML = '';
        this.contentContainer.innerHTML = '';
        categories.forEach(category => {
            const categoryLink = this.createCategoryLink(category);
            this.categoriesContainer.appendChild(categoryLink);
        });
        const specialsLink = this.createSpecialsLink(categories);
        this.categoriesContainer.appendChild(specialsLink);
    }
    createCategoryLink(category) {
        const categoryLink = document.createElement('a');
        categoryLink.href = '#';
        categoryLink.textContent = category.name;
        categoryLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.loadCategoryContent(category.shortname);
        });
        return categoryLink;
    }
    createSpecialsLink(categories) {
        const specialsLink = document.createElement('a');
        specialsLink.href = '#';
        specialsLink.textContent = 'Спеціальні пропозиції';
        specialsLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.loadRandomCategory(categories);
        });
        return specialsLink;
    }
    loadRandomCategory(categories) {
        const randomIndex = Math.floor(Math.random() * categories.length);
        const randomCategory = categories[randomIndex];
        this.loadCategoryContent(randomCategory.shortname);
    }
    loadCategoryContent(categoryShortname) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Завантаження вмісту категорії: ${categoryShortname}`);
                const response = yield fetch(`../src/data/${categoryShortname}.json`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = yield response.json();
                console.log('Отримані дані категорії:', data);
                this.renderCategoryContent(data);
            }
            catch (error) {
                console.error('Помилка завантаження вмісту категорії:', error);
            }
        });
    }
    renderCategoryContent(categoryData) {
        // Create elements instead of using innerHTML to avoid potential CSP issues
        const titleElement = document.createElement('h2');
        titleElement.textContent = categoryData.name;
        this.contentContainer.innerHTML = ''; // Clear previous content
        this.contentContainer.appendChild(titleElement);
        const productGrid = document.createElement('div');
        productGrid.classList.add('product-grid');
        categoryData.items.forEach(product => {
            const productElement = this.createProductElement(product);
            productGrid.appendChild(productElement);
        });
        this.contentContainer.appendChild(productGrid);
    }
    createProductElement(product) {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        const imgElement = document.createElement('img');
        imgElement.src = product.image;
        imgElement.alt = product.name;
        const nameElement = document.createElement('h3');
        nameElement.textContent = product.name;
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = product.description;
        const priceElement = document.createElement('p');
        priceElement.textContent = `Ціна: ${product.price} грн`;
        productElement.appendChild(imgElement);
        productElement.appendChild(nameElement);
        productElement.appendChild(descriptionElement);
        productElement.appendChild(priceElement);
        return productElement;
    }
}
// Use an IIFE to avoid global scope pollution
(function () {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM повністю завантажений');
        new CatalogApp();
    });
})();
