import { load } from "cheerio"
import { MongoClient } from "mongodb";
import dayjs from "dayjs"
import { requst } from "./conf/api";
import axios from "axios";
const client = new MongoClient("mongodb://xyyd:Dandg9293@139.159.177.76:4200?directConnection=true")
interface Ways {
    logos: string[];
    links: string[];
}

interface MovieData {
    poster: string;
    title: string;
    information: string;
    intro: string;
    score: number;
    scorelink: string;
    ways: Ways;
}

const fetchId = async () => {
    const res = await axios.get('https://www.cikeee.com');
    const html = await res.data;   // 将响应内容作为文本返回
    const $ = load(html);   // 使用 cheerio 解析 HTML

    const links = $('#movie-img-a').attr('href');
    // console.log(links);            // 输出:  /mov/680140189230713/
    return links || '';
};


const fetchData = async (): Promise<MovieData> => {
    const link = await fetchId();
    // console.log("链接",link)
    const result = await axios.get(`https://www.cikeee.com${link}`);
    const html = await result.data;
    const $ = load(html);

    // 海报
    const poster = $('.movie-img').attr('src') || '';
    // 标题
    const title = $('#movie-title').text();
    // 副标题
    const information = $('#movie-information').text();

    // 豆瓣评分链接    
    const scorelink = $('#rate-box').attr('href') || '';
    // 豆瓣评分
    const score = parseFloat($('#rate-box').text().trim());

    // 简介
    const intro = $('#movie-intro').text().trim();

    // 播放方式  腾讯视频/爱奇艺/优酷/乐视视频/芒果TV
    const ways: Ways = { logos: [], links: [] };
    let count = 0;
    let logoindex = 0;
    $('.link-box').each(function () {
        if (count >= 5) {
            return false; // 退出循环
        }
        const href = $(this).attr('href') || '';
        ways.links.push(href);
        count++;
    });

    $('.link-img').each((index, element) => {
        if (logoindex >= 5) {
            return false; // 退出循环
        }
        const wayLogo = $(element).attr('src') || '';
        ways.logos.push(wayLogo);
        logoindex++;
    });

    return {
        poster: `https://www.cikeee.com${poster}`,
        title,
        information,
        intro,
        score,
        scorelink,
        ways,
    };
};
async function main() {
    // await client.connect()
    // const db = client.db("crawlers")
    // const col = db.collection("dailyMovies")
    const data = await fetchData()
    const res = await requst('POST', '/nodeMovie-qwertyuiop', {
        data : {
            "str": "asdfghjkl",
            "NodeMovie": data
        }
    })
    console.log(res)
    // await col.updateOne({
    //     title: data.title,
    // }, { $set: { ...data, updated: dayjs().add(1, "day").format("YYYY-MM-DD HH:mm:ss") } }, {
    //     upsert: true
    // })
    // await client.close()
}

main() 