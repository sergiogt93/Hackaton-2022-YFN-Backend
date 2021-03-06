//Imports
const {connection} = require("../db");
const { program } = require("commander");
const { prompt } = require("inquirer");
const Developer  = require("../models/DeveloperModel");

//Inputs relations with developer
const developerQuestions = [
    {
        type: "input",
        message: "Put the name",
        name:"name"
    },
    {
        type: "input",
        message: "Put the email",
        name:"email"
    },
    {
        type:"list",
        name:"category",
        choices:[
            "Front","Back","Mobile", "Data",
        ]
    },
    {
        type:"input",
        message:"Put your phone",
        name:"phone"
    },
    {
        type:"list",
        message:"Choose the last day",
        name:"date",
        choices:[
            "Feb 28, 2021","Mar 1, 2021","Mar 2, 2021", "Mar 3, 2021",
        ]
    }
];

//Prepare the line command
program.version("1.0.0").description("Command line tool for managing the developers of the MWC");

//Show the days MWC
program.command("MWC-days").action(()=>{
    console.log("The event of the MWC are going to be between these days:\n Feb 28, 2021 \n Mar 1, 2021 \n Mar 2, 2021 \n Mar 3, 2021")
    process.exit(0);
})

//Show all developers
program.command("list").action(async () => {
    const developers = await Developer.find().lean();

    if(developers.length === 0) {
        console.log("No hay developers para ver");
    } else {
        console.table(developers.map(developer => ({
            _id: developer._id.toString(),
            name: developer.name,
            email: developer.email,
            category: developer.category,
            phone:developer.phone,
            date:developer.date
        })))
    }
    await connection.close();
    process.exit(0);
});

//Add a new developer
program.command("add").action( async () => {
    const answers= await prompt(developerQuestions)
    await Developer.create(answers)
    console.log("New assistant inserted")
    await connection.close()
    process.exit(0);
});

//Update a developer
program.command("update <id>").action( async (_id) =>{
    if (!_id) return console.log("please provide id")
    const answers = await prompt(developerQuestions)
    await Developer.updateOne({_id}, answers);
    console.log("Asistant updated");
    await connection.close();
    process.exit(0);
})

//Delete a developer
program.command("delete <id>").action( async (_id) => {
    if (!_id) return console.log("please provide id")
    await Developer.findByIdAndDelete(_id)
    console.log("Assistant deleted")
    await connection.close()
    process.exit(0);
});

//Save all commands created
program.parse(process.argv);