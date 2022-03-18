import express from 'express'
const app = express()
import cors from 'cors'
import mysql2 from 'mysql2'

app.use(express.json())
app.use(cors())


const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'saving_money'
})


// setInterval(()=>{
//     let hours = new Date().getHours()
//     let min = new Date().getMinutes()
//     let sec = new Date().getSeconds()

//     console.log(hours, min, sec)
//     // console.log(typeof(hours))
//     if(hours == 0){
//         db.query("SELECT * FROM users", (err, rs)=>{
//             if(err) throw err

//             rs.map((item)=>{
//                 if(item.start_date && item.end_date){
//                     let run_day = item.run_day
//                     run_day = run_day + 1
//                     console.log(run_day)
//                     db.query("UPDATE users SET run_day = ? WHERE name = ?", [run_day, item.name], (err, rs)=>{
//                         if(err) throw err

//                     })
//                 }
//             })
//         })

//         console.log("Server Updated Day")
//     }
// }, 1000)


app.get("/test", (req, res)=>{
    res.json("Hello")
})


app.post('/addUser', (req, res)=>{
    let user = req.body.user

    db.query("INSERT INTO users (name, day1, day2, day3, day4, day5, day6, day7, day8, day9, day10, day11, day12, day13, day14, day15, day16, day17, day18, day19, day20, day21, day22, day23, day24, day25, day26, day27, day28, day29, day30, day31) VALUES (?, ? ,? ,? ,?, ?, ? ,? ,? ,?, ?, ? ,? ,? ,?, ?, ? ,? ,? ,?, ?, ? ,? ,? ,?, ?, ? ,? ,? ,?, ?, ?)", [user, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], (err, rs)=>{
        if(err) throw err


        db.query("SELECT * FROM users WHERE user = ?", [user], (err, rs2)=>{
            res.json({success: true, user_data: rs2})
        })
    })
})

app.post('/login', (req, res)=>{

    let user = req.body.user

    db.query("SELECT * FROM users WHERE name = ?", [user], (err, rs)=>{
        if(err) throw err

        res.json({success: true, user_data: rs})
    })
})


app.post("/deposit", (req, res)=>{
    let user = req.body.user
    let all_day = req.body.all_day // id Item or day

    let temp = []

    all_day.map((item)=>{
        temp.push('day'+item+' = '+0)
    })

    console.log(String(temp))

    db.query("SELECT * FROM users WHERE name = ?", [user], (err, rs)=>{
        if(err) throw err

        let store_money = rs[0].total

        all_day.map((item)=>{
            store_money = store_money + item
        })

        db.query("UPDATE users SET "+String(temp)+", total = ? WHERE name = ?", [store_money ,user], (err, rs2)=>{
            if(err) throw err

            let deposit_count = rs[0].deposit_count
            deposit_count = deposit_count + all_day.length

            db.query("UPDATE users SET deposit_count = ? WHERE name = ?", [deposit_count ,user], (err, rs)=>{
                if(err) throw err

                res.json({success: true})
            })
        })
    })
})


app.post('/get_detail', (req, res)=>{
    let user = req.body.user

    db.query("SELECT * FROM users WHERE name = ?", [user], (err, rs)=>{
        if(err) throw err

        res.json(rs)
    })
})


app.post('/get_date', (req, res)=>{
    let start_date = req.body.start_date
    let end_date = req.body.end_date
    let user = req.body.user

    console.log(start_date)
    console.log(end_date)

    db.query("UPDATE users SET start_date = ?, end_date = ? WHERE name = ?", [JSON.stringify(start_date), JSON.stringify(end_date), user], (err, rs)=>{
        if(err) throw err

        res.json({success: true})
    })
})


app.listen(3001, ()=>{
    console.log("server is running on port 3001")
})