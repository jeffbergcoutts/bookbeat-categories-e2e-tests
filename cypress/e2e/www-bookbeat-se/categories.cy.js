describe('Categories Page', () => {
  beforeEach(() => {
    cy.visit('https://www.bookbeat.se/kategorier')

    //Can click on cookie banner if interfering with test
    //cy.get('[data-testid="accept-cookies"]').click()

  })

  it('displays 20 categories', () => {
    cy.get('[data-testid="category-card"]').should('have.length', 20)
  })

  it('can click on a category and display correct page', () => {
    cy.get('h2').contains('Science Fiction').click()
    cy.get('h1').first().should('have.text', 'Science fiction-böcker')
  
    //TO-DO Check breadcrumb - no good selector for this div
    //cy.get('div').contains('span', 'Kategorier').last().should('have.text', 'Science Fiction')
  })
})

describe('Sub-Category Page', () => {
  beforeEach(() => {
    //Run tests against "Barn" sub-category page
    cy.visit('https://www.bookbeat.se/kategori/barn-46084')
  })

  it('can filter by format and language', () => {
    // Filter by E-book & Arabic
    cy.get('button').contains('E-böcker').click()
    cy.url().should('include', 'format=ebook')
    cy.get('button').contains('Arabiska').click()
    cy.url().should('include', 'language=Arabic')
  
    //Verify Result
    cy.get('*[class^="bookGrid"] a:first').should('have.attr', 'title', 'Blåhvalen (Arabisk)')
  
    //Turn off E-book filter and turn on Audiobook filter
    cy.get('button').contains('E-böcker').click()
    cy.get('button').contains('Ljudböcker').click()
    
    //Verify Result
    cy.get('*[class^="bookGrid"] a:first').should('have.attr', 'title', 'Hans Christian Andersen´s magiska värld - Bok 1')
  })

  it('keeps filters selected when changing category & sorting', () => {
    //Spy on Network Requests so we can wait for them and assert against them
    cy.intercept('GET', '/api/discovery/search/categories*format=audiobook*')
      .as('filter-audiobook')
    cy.intercept('GET', '/api/discovery/search/categories*language=English*')
      .as('filter-language')
    cy.intercept('GET', '/api/discovery/search/categories*id=fran-0-ar-46085*')
      .as('filter-sub-category')

    //Click on a Format and a Langauge Filter & wait for request response
    cy.get('button').contains('Ljudböcker').click()
    cy.wait('@filter-audiobook')
    cy.get('button').contains('Engelska').click()
    cy.wait('@filter-language')
    
    //Confirm that the correct query params exist in the url and the correct buttons are highlighted
    cy.url()
      .should('include', 'format=audiobook')
      .and('include', 'language=English')

    cy.get('button').contains('button', 'Ljudböcker')
      .should(($button) => {
        const className = $button[0].className
        expect(className).to.match(/ToggleButton_checked/)
      })
    cy.get('button').contains('button', 'Engelska')
    .should(($button) => {
      const className = $button[0].className
      expect(className).to.match(/ToggleButton_checked/)
    })
  
    //Click on sub-category, check that request still includes filters
    cy.get('a').contains('Från 0 år').click()
    cy.wait('@filter-sub-category')
      .its('request.url')
      .should('include', 'format=audiobook')
      .and('include', 'language=English')
    

    //Verify first result is correct
    cy.get('*[class^="bookGrid"] a:first').should('have.attr', 'title', 'Alice in Wonderland')
  })
})

it('can sort results', () => {
  //TO-DO Check Sorting
})

describe('Language Sub-Category Page', () => {
  beforeEach(() => {
    cy.visit('https://www.bookbeat.se/kategori/english-46106')
  })

  it('hides language filters', () => {
    cy.get('h1').first().should('have.text', 'English')
    //TO-DO Check that "Språk" doesn't show in Filters
  })
})