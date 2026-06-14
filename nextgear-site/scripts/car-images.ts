/**
 * Per-car image map  —  YOUR FILL-IN CHECKLIST.
 *
 * Each car in the seed gets ITS OWN image here (no shared/round-robin photos,
 * so a RAV4 always shows a RAV4 and no two cars collide). The key is
 * `Make|Model|Year` and must match the entry in seed.ts exactly.
 *
 * HOW TO FILL:
 *   1. Paste a DIRECT image URL (ends in .jpg/.png/.webp, opens on its own).
 *      A web PAGE url (e.g. driving.ca/.../2021/) will NOT work — open the image
 *      itself ("Open image in new tab" / "Copy image address") and use that.
 *   2. Use a real photo of THAT make/model/year — ideally the listed colour.
 *   3. Landscape, HD (≥ 1200×800).
 *   4. Leave "" for any car you haven't sourced yet — the seed prints which are
 *      still missing so you can fill them step by step, then re-seed.
 *
 * After editing, run:  npm run seed   (from the nextgear-site folder)
 */

export const CAR_IMAGES: Record<string, string> = {
  // ───────────── SUV ─────────────
  "Toyota|RAV4|2021": "https://driving.ca/toyota/rav4/2021/",
  "Honda|CR-V|2020": "https://www.greenncap.com/assessments/honda-cr-v-2024-0188/",
  "Mazda|CX-5|2022": "https://di-uploads-pod24.dealerinspire.com/greenwaymazda/uploads/2024/09/Greenway_Mazda_25_CX-5_trims_jelly6.png",
  "Subaru|Forester|2019": "https://platform.cstatic-images.com/in/v2/stock_photos/8ffb91e2-c376-4a5a-bc34-660a9d13d4f2/628b899e-2f13-4594-b76a-d4af18552976.png",
  "Jeep|Grand Cherokee|2018": "https://di-uploads-pod11.dealerinspire.com/yorkchryslerdodgejeep/uploads/2018/06/2018-Jeep-Grand-Cherokee-Hero.png",
  "Ford|Explorer|2020": "https://platform.cstatic-images.com/xxlarge/in/v2/stock_photos/0b0ecec0-8924-419a-b4d1-57d90817af84/4ee38d49-5798-4280-be75-e5faddbfacce.png",
  "Hyundai|Tucson|2021": "https://platform.cstatic-images.com/in/v2/stock_photos/b809ff8e-c7f9-41c0-ab77-de7c009ffbb1/4f2bcf17-1a7b-40d8-8ee4-40168732652f.png",
  "Kia|Sportage|2022": "https://platform.cstatic-images.com/xxlarge/in/v2/stock_photos/ec650d85-823f-4dfa-bfb3-f8b98194fac0/93e367b6-f076-45bf-89c7-aed01e33defb.png",
  "Toyota|Highlander|2019": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJBBvubD_BKbXKpRSTfx0TvEb1TPEbcTRUkLARlddUcA&s=10",
  "Chevrolet|Tahoe|2017": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDvEuGqw2JxBkGHerz80c4MezYFlmInawZo9Sc4SQsTg&s=10",
  "Ford|Mustang Mach-E|2022": "https://platform.cstatic-images.com/in/v2/stock_photos/e5abea60-ce38-4e59-805b-2a3a97de8647/d01c7982-5d5c-45a0-85ac-056882a411d3.png",

  // ───────────── Sedan ─────────────
  "Toyota|Camry|2021": "https://platform.cstatic-images.com/in/v2/stock_photos/9eb880fa-f0d3-4471-8c23-547b5d1fb3a9/3fba41df-5999-4ad5-96dc-459b3f4b78ee.png",
  "Honda|Accord|2020": "https://platform.cstatic-images.com/in/v2/stock_photos/6fe8fc01-08c1-4074-adcb-1372f92a69e5/fcbbd92c-9527-4279-a8e3-6a2224945cf3.png",
  "Honda|Civic|2022": "https://platform.cstatic-images.com/in/v2/stock_photos/48df7ea7-63e4-47b2-9f18-4669e90fe4c6/1ef78eae-ba75-4c93-b8dd-101b210fb843.png",
  "Toyota|Corolla|2021": "https://platform.cstatic-images.com/in/v2/stock_photos/a1bd413b-0726-49b1-929b-53f83760953a/3f618153-c2c3-41e2-9684-5493885a6d53.png",
  "Nissan|Altima|2019": "https://platform.cstatic-images.com/in/v2/stock_photos/69a78353-942a-4849-832e-06d66010acb4/867d0768-dbaf-48c9-9ea9-51c615171b66.png",
  "Mazda|Mazda3|2021": "https://platform.cstatic-images.com/in/v2/stock_photos/7c41ed4e-42a3-4f56-9dac-d80a2050871d/fec8907d-34c5-4374-9d80-da0f6e4a9a55.png",
  "Hyundai|Elantra|2022": "https://platform.cstatic-images.com/in/v2/stock_photos/4825d411-30aa-4fe4-8e13-510a538f9991/74c2f29a-da6d-486b-b61f-3710c6198732.png",
  "Volkswagen|Passat|2018": "https://platform.cstatic-images.com/in/v2/stock_photos/4f3258ef-b050-47bc-bb2d-94c0c681fe82/f96ef6db-801c-49e2-94db-4afc2250c4cb.png",
  "BMW|3 Series|2019": "https://platform.cstatic-images.com/xxlarge/in/v2/stock_photos/ada3f92d-a785-44a9-8f30-103f48df5be6/b32c196d-7401-4c36-b605-3a27f9c80cc4.png",
  "Mercedes-Benz|C-Class|2018": "https://platform.cstatic-images.com/xlarge/in/v2/stock_photos/9597c2d4-85f5-4e06-b867-490695ce9a8a/c49b3e46-34b5-43ea-9d53-bf4f6be8687f.png",
  "Tesla|Model 3|2021": "https://platform.cstatic-images.com/in/v2/stock_photos/34244430-b7b9-4291-99de-5e1392c670ff/5622e9c0-90e7-4848-bba6-24e60940e327.png",

  // ───────────── Coupe ─────────────
  "Ford|Mustang|2019": "https://platform.cstatic-images.com/in/v2/stock_photos/06e69f49-f341-4857-936a-b3cb620c0af9/2068526c-acd8-449c-b280-316456cb0add.png",
  "Chevrolet|Camaro|2018": "https://platform.cstatic-images.com/in/v2/stock_photos/0a485054-0c8e-4429-bb70-b840f4c4f342/a2d2fd67-aae3-49f1-ab28-4b7fdefefaa7.png",
  "BMW|4 Series|2020": "https://platform.cstatic-images.com/xxlarge/in/v2/stock_photos/2bba0f0d-c41e-4423-bad5-ce0416a00c2c/7113a802-5a45-4365-a5fd-6de61afcd57f.png",
  "Audi|A5|2019": "https://platform.cstatic-images.com/xxlarge/in/v2/stock_photos/e60259bf-f58e-47cc-bf15-bd5b78418ce2/29692938-0ec0-43b1-8589-af7f4e05050a.png",
  "Dodge|Challenger|2021": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy75TEqFSQC2-uKd7CI8ncv8U7dFVXl5I6VKuINSitfw&s=10",

  // ───────────── Truck ─────────────
  "Ford|F-150|2020": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyCGjEd9iNjE2FVAWOjU01c8g4zK8FAkT3inypyopqQA&s=10",
  "Chevrolet|Silverado 1500|2019": "https://platform.cstatic-images.com/in/v2/stock_photos/b5f650ba-69a4-45f2-b2d1-3af52666b79b/8954d507-594e-4368-9dbc-6d9219f3d8c3.png",
  "Ram|1500|2021": "https://platform.cstatic-images.com/in/v2/stock_photos/3ae38139-3152-435f-9b11-bfafff408969/96b666ad-f4cf-4473-9741-f5cd38d6a511.png",
  "Toyota|Tacoma|2020": "https://platform.cstatic-images.com/in/v2/stock_photos/18dddfe6-8225-46b5-89b2-6493bbadc355/2ff5c4ce-0554-4568-a766-7c7638581071.png",
  "GMC|Sierra 1500|2018": "https://platform.cstatic-images.com/in/v2/stock_photos/fd76ac5f-f140-46bf-a2c3-3802d352d3b6/a2aa4051-2e04-4e78-a5b2-9fc5c271213c.png",
  "Ford|Ranger|2022": "https://platform.cstatic-images.com/in/v2/stock_photos/bf240525-f1f0-459d-92ab-51205545be2e/db6edf07-3735-4970-9395-901f159b768f.png",

  // ───────────── Convertible ─────────────
  "Mazda|MX-5 Miata|2019": "https://platform.cstatic-images.com/xlarge/in/v2/stock_photos/8573e5e3-5900-4323-8daf-408a7bd07d44/d27375a1-ab8b-4bea-803f-04f8b8d1b98a.png",
  "Ford|Mustang Convertible|2018": "https://platform.cstatic-images.com/in/v2/stock_photos/4bf4417d-d529-4993-a134-1ae992de3f0b/05a5a5ad-1074-477a-a564-e8081801e4b8.png",
  "BMW|Z4|2020": "https://platform.cstatic-images.com/in/v2/stock_photos/baa6a6ef-902d-4fdb-972f-3c9c33b9c2a0/ffe779e2-7cbf-407b-bb35-50f9c597fc62.png",
  "Chevrolet|Corvette|2017": "https://platform.cstatic-images.com/in/v2/stock_photos/365230ae-8cf5-42fd-bef9-b9704fb6b25e/2a613376-4db0-4f3e-95e5-9bfc1d0d1323.png",

  // ───────────── Hatchback ─────────────
  "Volkswagen|Golf|2019": "https://platform.cstatic-images.com/in/v2/stock_photos/6b8225c4-b700-4045-b754-225ecbd1b311/88e0e9f9-ecd8-40a9-8d83-1c80f22a10ab.png",
  "Honda|Civic Hatchback|2021": "https://platform.cstatic-images.com/xxlarge/in/v2/stock_photos/f5f7140b-18a0-4351-bbd2-ccd7bbb4387a/6420911b-62e7-42ec-8abc-8313c34ee96a.png",
  "Mazda|Mazda3 Hatchback|2020": "https://platform.cstatic-images.com/large/in/v2/168a8465-3ec9-5dc8-94b5-2dd1d66ed5a9/ff888989-55d6-47a9-961f-f47c06d25626/MwkDq9wdTBazdXiV2GEPzxYo6PU.jpg",
  "Toyota|Corolla Hatchback|2021": "https://platform.cstatic-images.com/in/v2/stock_photos/a1bd413b-0726-49b1-929b-53f83760953a/3f618153-c2c3-41e2-9684-5493885a6d53.png",
  "Toyota|Prius|2020": "https://platform.cstatic-images.com/in/v2/stock_photos/5284f8ec-dfc6-4626-885c-70383f49c115/3d07a754-494a-4d34-b45c-2e79ed8d7f00.png",
  "Chevrolet|Bolt EV|2021": "https://platform.cstatic-images.com/in/v2/stock_photos/9d583295-8987-4768-849f-e2970949d8ef/12b4712f-f786-4489-9d8c-26140a412dd3.png",

  // ───────────── Van ─────────────
  "Honda|Odyssey|2019": "https://platform.cstatic-images.com/in/v2/stock_photos/3ba318e0-281c-4b79-8316-492572adc60d/4f2f9c57-f3bc-4dba-a640-4849cd31069f.png",
  "Toyota|Sienna|2021": "https://platform.cstatic-images.com/xxlarge/in/v2/stock_photos/7237c481-95e2-45ff-b217-4a89da3652e5/3604c7ae-5834-4784-9824-46ffc9f49fb7.png",
  "Chrysler|Pacifica|2020": "https://platform.cstatic-images.com/in/v2/stock_photos/94da6a2f-99a0-4afd-8cbf-1cde4719e5e9/65b3f844-14ba-44f4-b90c-a4e2e0dfb39a.png",
  "Kia|Carnival|2022": "https://platform.cstatic-images.com/in/v2/stock_photos/d56205d0-d1d1-4a28-bace-e7d10c7072d3/07e49296-92c9-43a7-a14e-6b60b28eb0e4.png",

  // ───────────── Wagon ─────────────
  "Subaru|Outback|2020": "https://platform.cstatic-images.com/in/v2/stock_photos/b4792ebd-928f-4b2d-a3cb-2d3d90ab134f/0aaf58ff-4f59-428b-a62e-50c6dea6aa1e.png",
  "Volvo|V60|2019": "https://platform.cstatic-images.com/in/v2/stock_photos/2330cda9-c4c9-4b87-93fd-826181f01a77/bd223ebd-c43f-46a9-b9e7-ce910cd4df63.png",
  "Audi|A4 Allroad|2018": "https://platform.cstatic-images.com/in/v2/stock_photos/ffb62237-5864-4005-a738-bad15231ba09/5a9ea4e8-fcb2-4df6-a343-09b3ccbfbdbc.png",
  "Volkswagen|Golf SportWagen|2018": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDaHmv3xFAqu--N7X3gom_oKOxQUq-nFIIFTRa2S_cAQ&s=10",
};

/** Stable key for a car's image lookup. Must match seed.ts make/model/year. */
export function imageKey(make: string, model: string, year: number): string {
  return `${make}|${model}|${year}`;
}
