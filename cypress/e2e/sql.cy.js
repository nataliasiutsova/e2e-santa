describe('Connect to test DB', () => {
  it('Create a table', () => {
    cy.task(
      'queryDb',
      'CREATE TABLE Students(StudentID int, FirstName varchar(255), StudentGroup varchar(255), City varchar(255))'
    );
  });

  it('Input three students into the table', () => {
    cy.task(
      'queryDb',
      `INSERT INTO Students(StudentID,FirstName,StudentGroup,City) VALUES
    (1,'Ivan','02-2022','Barselona'),
    (2,'Maria','03-2022','Tokio'),
    (3,'Andrey','02-2023','Milan');`
    ).then((result) => {
      cy.log(JSON.stringify(result));
      expect(result.affectedRows).to.equal(3);
    });
  });

  it('Select student, who live in Milan', () => {
    cy.task(
      'queryDb',
      `SELECT FirstName FROM Students WHERE City='Milan'`
    ).then((result) => {
      cy.log(JSON.stringify(result));
      expect(result[0].FirstName).to.equal('Andrey');
    });
  });

  it('Input two new students into the table', () => {
    cy.task(
      'queryDb',
      `INSERT INTO Students(StudentID,FirstName,StudentGroup,City) VALUES
      (4,'Anna','03-2022','Gdansk'),
      (5,'Natalia','03-2022','Johannesburg');`
    ).then((result) => {
      cy.log(JSON.stringify(result));
      expect(result.affectedRows).to.equal(2);
    });
  });

  it('Select all students from group', () => {
    cy.task(
      'queryDb',
      `SELECT * FROM Students WHERE StudentGroup='03-2022'`
    ).then((result) => {
      cy.log(JSON.stringify(result));
      expect(result[0].FirstName).to.equal('Maria');
      expect(result[1].FirstName).to.equal('Anna');
      expect(result[2].FirstName).to.equal('Natalia');
    });
  });

  it('Delete a Table', () => {
    cy.task('queryDb', 'DROP TABLE Students');
  });
});
