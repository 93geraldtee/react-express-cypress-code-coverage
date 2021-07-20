describe('functional test 1', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
    })

    it('clicks on first two options', () => {
        cy.get('#root > div > div > li:nth-child(1)').click()
        cy.get('#root > div > div > div > div').click()
        
        cy.get('#root > div > div > li:nth-child(2)').click()
        cy.get('#root > div > div > div > div').click()
    })
})