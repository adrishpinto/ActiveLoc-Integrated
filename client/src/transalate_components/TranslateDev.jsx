import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Xliff2Text from "./Xliff2Text.jsx";
const API_URL = import.meta.env.VITE_URL;

const TranslateDev = () => {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("fr");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  // upload download functions start
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.", {
        autoClose: 1500,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        withCredentials: true,
      });
      toast.success("file uploaded succesfully", { autoClose: 2000 });
      console.log("File uploaded successfully", response.data);
    } catch (error) {
      toast.error("Error uploading file ", { autoClose: 2000 });
      console.error("Error uploading file:", error);
    }
  };

  const xliffDownload = async () => {
    try {
      const response = await axios.get(`${API_URL}/xliff`, {
        responseType: "blob",
        withCredentials: true,
      });

      if (response.status !== 200) {
        toast.error("Error in downloading File", { autoClose: 1500 });
        throw new Error("Failed to download the file");
      }

      const url = window.URL.createObjectURL(response.data);

      const a = document.createElement("a");
      a.href = url;
      a.download = "output.xliff";
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const download = async () => {
    try {
      // Step 1: Fetch the file extension
      const extensionRes = await axios.get(`${API_URL}/extension`, {
        withCredentials: true,
      });
      let { extension } = extensionRes.data;
      if (extension == "ocx") {
        extension = "docx";
      }

      const res = await axios.get(`${API_URL}/download`, {
        responseType: "blob",
        withCredentials: true,
      });

      console.log(res);

      const fileURL = window.URL.createObjectURL(new Blob([res.data]));

      let fileName = `downloaded-file.${extension}`;

      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(fileURL);
      toast.success("File has downloaded succesfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("File is still translating. Please wait for a few seconds.", {
        autoClose: 2000,
      });
    }
  };

  // upload download functions end

  // translate files start
  const translateFile = async () => {
    const data = { language };

    try {
      const response = await axios.post(`${API_URL}/translate`, data, {
        withCredentials: true,
      });
      toast.success("File is currently being translated");
      console.log("Response:", response.data);
    } catch (error) {
      toast.error("Error with translating file Please try again later.");
      console.error("Error:", error);
    }
  };
  //translate files end

  // get user data and auth start
  const [group, setGroup] = useState("");
  const [name, setName] = useState("");

  const cookieData = async () => {
    try {
      const res = await axios.get(`${API_URL}/cookie-data`, {
        withCredentials: true,
      });
      setGroup(res.data.group);
      setName(res.data.name);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyUser = async () => {
    try {
      if (group === "Customer" || group === "Admin" || group === "Operations") {
        console.log("Access granted");
      } else {
        console.log("Access denied");

        document.body.innerHTML =
          "<h1>You are not allowed access for translation model</h1>";
        document.body.style.pointerEvents = "none";
      }
    } catch (error) {
      console.error("An error occurred during verification:", error);
    }
  };

  useEffect(() => {
    cookieData();
  }, []);

  useEffect(() => {
    if (group) {
      verifyUser();
    }
  }, [group]);

  //get user data and auth end
  return (
    <div>
      <div className="text-5xl text-center mt-20" onClick={() => cookieData}>
        {name ? `Welcome, ${name}` : "Please Login first to access modules"}
      </div>
      <div className="sm:w-[80%] w-[90%] lg:w-[50%] border border-black rounded-lg bg-slate-50 shadow-lg mx-auto mt-20 p-10 pt-5 flex flex-col items-center">
        <div>
          <h1 className="mb-5 text-3xl font-semibold text-center">
            Translation Module
          </h1>
          <div className="mb-10 border bg-slate-300 p-2 rounded">
            <p>1. Choose a file and click on upload button</p>
            <p>2. Click on translate and then click on download</p>
            <p>3. Once file is downloaded then xliff download will work </p>
            <p>4. Using the downloaded xliff you can use xliff module</p>
            <p>5. Allowed files - pdf, txt, docx</p>
          </div>
        </div>
        <div className="w-fit">
          <input
            type="file"
            onChange={handleFileChange}
            className="border bg-slate-100 text-center w-[230px] "
          />
        </div>

        <div className="mt-5">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border bg-slate-200 text-center w-fit outline-none cursor-pointer p-2 px-4 rounded "
          >
            <option value="af-ZA" className="text-left hover:cursor-pointer">
              1. Afrikaans - South Africa
            </option>
            <option value="am-ET" className="text-left hover:cursor-pointer">
              2. Amharic - Ethiopia
            </option>
            <option value="ar-AE" className="text-left hover:cursor-pointer">
              3. Arabic - U.A.E.
            </option>
            <option value="ar-BH" className="text-left hover:cursor-pointer">
              4. Arabic - Bahrain
            </option>
            <option value="ar-DZ" className="text-left hover:cursor-pointer">
              5. Arabic - Algeria
            </option>
            <option value="ar-EG" className="text-left hover:cursor-pointer">
              6. Arabic - Egypt
            </option>
            <option value="ar-IQ" className="text-left hover:cursor-pointer">
              7. Arabic - Iraq
            </option>
            <option value="ar-JO" className="text-left hover:cursor-pointer">
              8. Arabic - Jordan
            </option>
            <option value="ar-KW" className="text-left hover:cursor-pointer">
              9. Arabic - Kuwait
            </option>
            <option value="ar-LB" className="text-left hover:cursor-pointer">
              10. Arabic - Lebanon
            </option>
            <option value="ar-LY" className="text-left hover:cursor-pointer">
              11. Arabic - Libya
            </option>
            <option value="ar-MO" className="text-left hover:cursor-pointer">
              12. Arabic - Morocco
            </option>
            <option value="ar-OM" className="text-left hover:cursor-pointer">
              13. Arabic - Oman
            </option>
            <option value="ar-QA" className="text-left hover:cursor-pointer">
              14. Arabic - Qatar
            </option>
            <option value="ar-SA" className="text-left hover:cursor-pointer">
              15. Arabic - Saudi Arabia
            </option>
            <option value="ar-SY" className="text-left hover:cursor-pointer">
              16. Arabic - Syria
            </option>
            <option value="ar-TN" className="text-left hover:cursor-pointer">
              17. Arabic - Tunisia
            </option>
            <option value="ar-YE" className="text-left hover:cursor-pointer">
              18. Arabic - Yemen
            </option>
            <option value="as-IN" className="text-left hover:cursor-pointer">
              19. Assamese - India
            </option>
            <option value="be-BY" className="text-left hover:cursor-pointer">
              20. Belarusian - Belarus
            </option>
            <option value="bg-BG" className="text-left hover:cursor-pointer">
              21. Bulgarian - Bulgaria
            </option>
            <option value="bn-BD" className="text-left hover:cursor-pointer">
              22. Bangla - Bangladesh
            </option>
            <option value="bn-IN" className="text-left hover:cursor-pointer">
              23. Bengali - India
            </option>
            <option value="bo-BT" className="text-left hover:cursor-pointer">
              24. Tibetan - Bhutan
            </option>
            <option value="bo-CN" className="text-left hover:cursor-pointer">
              25. Tibetan - People's Republic of China
            </option>
            <option value="ca-ES" className="text-left hover:cursor-pointer">
              26. Catalan - Spain
            </option>
            <option value="cs-CZ" className="text-left hover:cursor-pointer">
              27. Czech - Czech Republic
            </option>
            <option value="cy-GB" className="text-left hover:cursor-pointer">
              28. Welsh - United Kingdom
            </option>
            <option value="da-DK" className="text-left hover:cursor-pointer">
              29. Danish - Denmark
            </option>
            <option value="de-AT" className="text-left hover:cursor-pointer">
              30. German - Austria
            </option>
            <option value="de-CH" className="text-left hover:cursor-pointer">
              31. German - Switzerland
            </option>
            <option value="de-DE" className="text-left hover:cursor-pointer">
              32. German - Germany
            </option>
            <option value="de-LI" className="text-left hover:cursor-pointer">
              33. German - Liechtenstein
            </option>
            <option value="de-LU" className="text-left hover:cursor-pointer">
              34. German - Luxembourg
            </option>
            <option value="dv-MV" className="text-left hover:cursor-pointer">
              35. Divehi - Maldives
            </option>
            <option value="el-GR" className="text-left hover:cursor-pointer">
              36. Greek - Greece
            </option>
            <option value="en-AU" className="text-left hover:cursor-pointer">
              37. English - Australia
            </option>
            <option value="en-BZ" className="text-left hover:cursor-pointer">
              38. English - Belize
            </option>
            <option value="en-CA" className="text-left hover:cursor-pointer">
              39. English - Canada
            </option>
            <option value="en-GB" className="text-left hover:cursor-pointer">
              40. English - United Kingdom
            </option>
            <option value="en-HK" className="text-left hover:cursor-pointer">
              41. English - Hong Kong SAR
            </option>
            <option value="en-ID" className="text-left hover:cursor-pointer">
              42. English - Indonesia
            </option>
            <option value="en-IE" className="text-left hover:cursor-pointer">
              43. English - Ireland
            </option>
            <option value="en-IN" className="text-left hover:cursor-pointer">
              44. English - India
            </option>
            <option value="en-JM" className="text-left hover:cursor-pointer">
              45. English - Jamaica
            </option>
            <option value="en-MY" className="text-left hover:cursor-pointer">
              46. English - Malaysia
            </option>
            <option value="en-NZ" className="text-left hover:cursor-pointer">
              47. English - New Zealand
            </option>
            <option value="en-PH" className="text-left hover:cursor-pointer">
              48. English - Philippines
            </option>
            <option value="en-SG" className="text-left hover:cursor-pointer">
              49. English - Singapore
            </option>
            <option value="en-TT" className="text-left hover:cursor-pointer">
              50. English - Trinidad
            </option>
            <option value="en-US" className="text-left hover:cursor-pointer">
              51. English - United States
            </option>
            <option value="en-ZA" className="text-left hover:cursor-pointer">
              52. English - South Africa
            </option>
            <option value="en-ZW" className="text-left hover:cursor-pointer">
              53. English - Zimbabwe
            </option>
            <option value="es-AR" className="text-left hover:cursor-pointer">
              54. Spanish - Argentina
            </option>
            <option value="es-BO" className="text-left hover:cursor-pointer">
              55. Spanish - Bolivia
            </option>
            <option value="es-CL" className="text-left hover:cursor-pointer">
              56. Spanish - Chile
            </option>
            <option value="es-CO" className="text-left hover:cursor-pointer">
              57. Spanish - Colombia
            </option>
            <option value="es-CR" className="text-left hover:cursor-pointer">
              58. Spanish - Costa Rica
            </option>
            <option value="es-DO" className="text-left hover:cursor-pointer">
              59. Spanish - Dominican Republic
            </option>
            <option value="es-EC" className="text-left hover:cursor-pointer">
              60. Spanish - Ecuador
            </option>
            <option value="es-ES" className="text-left hover:cursor-pointer">
              61. Spanish - Spain (Modern Sort)
            </option>
            <option value="es-GT" className="text-left hover:cursor-pointer">
              62. Spanish - Guatemala
            </option>
            <option value="es-HN" className="text-left hover:cursor-pointer">
              63. Spanish - Honduras
            </option>
            <option value="es-MX" className="text-left hover:cursor-pointer">
              64. Spanish - Mexico
            </option>
            <option value="es-NI" className="text-left hover:cursor-pointer">
              65. Spanish - Nicaragua
            </option>
            <option value="es-PA" className="text-left hover:cursor-pointer">
              66. Spanish - Panama
            </option>
            <option value="es-PE" className="text-left hover:cursor-pointer">
              67. Spanish - Peru
            </option>
            <option value="es-PR" className="text-left hover:cursor-pointer">
              68. Spanish - Puerto Rico
            </option>
            <option value="es-PY" className="text-left hover:cursor-pointer">
              69. Spanish - Paraguay
            </option>
            <option value="es-SV" className="text-left hover:cursor-pointer">
              70. Spanish - El Salvador
            </option>
            <option value="es-US" className="text-left hover:cursor-pointer">
              71. Spanish - United States
            </option>
            <option value="es-UY" className="text-left hover:cursor-pointer">
              72. Spanish - Uruguay
            </option>
            <option value="es-VE" className="text-left hover:cursor-pointer">
              73. Spanish - Venezuela
            </option>
            <option value="et-EE" className="text-left hover:cursor-pointer">
              74. Estonian - Estonia
            </option>
            <option value="eu-ES" className="text-left hover:cursor-pointer">
              75. Basque - Spain
            </option>
            <option value="fa-IR" className="text-left hover:cursor-pointer">
              76. Persian - Iran
            </option>
            <option value="fi-FI" className="text-left hover:cursor-pointer">
              77. Finnish - Finland
            </option>
            <option value="fo-FO" className="text-left hover:cursor-pointer">
              78. Faroese - Faroe Islands
            </option>
            <option value="fr-BE" className="text-left hover:cursor-pointer">
              79. French - Belgium
            </option>
            <option value="fr-CA" className="text-left hover:cursor-pointer">
              80. French - Canada
            </option>
            <option value="fr-CG" className="text-left hover:cursor-pointer">
              81. French - Democratic Rep. of Congo
            </option>
            <option value="fr-CH" className="text-left hover:cursor-pointer">
              82. French - Switzerland
            </option>
            <option value="fr-CI" className="text-left hover:cursor-pointer">
              83. French - Cote d'Ivoire
            </option>
            <option value="fr-CM" className="text-left hover:cursor-pointer">
              84. French - Cameroon
            </option>
            <option value="fr-FR" className="text-left hover:cursor-pointer">
              85. French - France
            </option>
            <option value="fr-HT" className="text-left hover:cursor-pointer">
              86. French - Haiti
            </option>
            <option value="fr-LU" className="text-left hover:cursor-pointer">
              87. French - Luxembourg
            </option>
            <option value="fr-MA" className="text-left hover:cursor-pointer">
              88. French - Morocco
            </option>
            <option value="fr-MC" className="text-left hover:cursor-pointer">
              89. French - Monaco
            </option>
            <option value="fr-ML" className="text-left hover:cursor-pointer">
              90. French - Mali
            </option>
            <option value="fr-RE" className="text-left hover:cursor-pointer">
              91. French - Reunion
            </option>
            <option value="fr-SN" className="text-left hover:cursor-pointer">
              92. French - Senegal
            </option>
            <option value="fy-NL" className="text-left hover:cursor-pointer">
              93. Frisian - Netherlands
            </option>
            <option value="ga-IE" className="text-left hover:cursor-pointer">
              94. Irish - Ireland
            </option>
            <option value="gd-GB" className="text-left hover:cursor-pointer">
              95. Scottish Gaelic - United Kingdom
            </option>
            <option value="gl-ES" className="text-left hover:cursor-pointer">
              96. Galician - Spain
            </option>
            <option value="gn-PY" className="text-left hover:cursor-pointer">
              97. Guarani - Paraguay
            </option>
            <option value="gu-IN" className="text-left hover:cursor-pointer">
              98. Gujarati - India
            </option>
            <option value="he-IL" className="text-left hover:cursor-pointer">
              99. Hebrew - Israel
            </option>
            <option value="hi-IN" className="text-left hover:cursor-pointer">
              100. Hindi - India
            </option>
            <option value="hr-BA" className="text-left hover:cursor-pointer">
              101. Croatian - Bosnia and Herzegovina
            </option>
            <option value="hr-HR" className="text-left hover:cursor-pointer">
              102. Croatian - Croatia
            </option>
            <option value="hu-HU" className="text-left hover:cursor-pointer">
              103. Hungarian - Hungary
            </option>
            <option value="hy-AM" className="text-left hover:cursor-pointer">
              104. Armenian - Armenia
            </option>
            <option value="id-ID" className="text-left hover:cursor-pointer">
              105. Indonesian - Indonesia
            </option>
            <option value="ig-NG" className="text-left hover:cursor-pointer">
              106. Igbo - Nigeria
            </option>
            <option value="ii-CN" className="text-left hover:cursor-pointer">
              107. Yi - China
            </option>
            <option value="is-IS" className="text-left hover:cursor-pointer">
              108. Icelandic - Iceland
            </option>
            <option value="it-CH" className="text-left hover:cursor-pointer">
              109. Italian - Switzerland
            </option>
            <option value="it-IT" className="text-left hover:cursor-pointer">
              110. Italian - Italy
            </option>
            <option value="ja-JP" className="text-left hover:cursor-pointer">
              111. Japanese
            </option>
            <option value="ka-GE" className="text-left hover:cursor-pointer">
              112. Georgian
            </option>
            <option value="kk-KZ" className="text-left hover:cursor-pointer">
              113. Kazakh
            </option>
            <option value="km-KH" className="text-left hover:cursor-pointer">
              114. Khmer
            </option>
            <option value="kn-IN" className="text-left hover:cursor-pointer">
              115. Kannada
            </option>
            <option value="ko-KR" className="text-left hover:cursor-pointer">
              116. Korean
            </option>
            <option value="kr-NG" className="text-left hover:cursor-pointer">
              117. Kanuri - Nigeria
            </option>
            <option value="ky-KG" className="text-left hover:cursor-pointer">
              118. Kyrgyz (Cyrillic)
            </option>
            <option value="la" className="text-left hover:cursor-pointer">
              119. Latin
            </option>
            <option value="lo-LA" className="text-left hover:cursor-pointer">
              120. Lao
            </option>
            <option value="lt-LT" className="text-left hover:cursor-pointer">
              121. Lithuanian
            </option>
            <option value="lv-LV" className="text-left hover:cursor-pointer">
              122. Latvian
            </option>
            <option value="mi-NZ" className="text-left hover:cursor-pointer">
              123. Maori - New Zealand
            </option>
            <option value="mk-MK" className="text-left hover:cursor-pointer">
              124. Macedonian
            </option>
            <option value="ml-IN" className="text-left hover:cursor-pointer">
              125. Malayalam
            </option>
            <option value="mni" className="text-left hover:cursor-pointer">
              126. Manipuri
            </option>
            <option value="mn-MN" className="text-left hover:cursor-pointer">
              127. Mongolian (Cyrillic)
            </option>
            <option value="mr-IN" className="text-left hover:cursor-pointer">
              128. Marathi
            </option>
            <option value="ms-BN" className="text-left hover:cursor-pointer">
              129. Malay - Brunei Darussalam
            </option>
            <option value="ms-MY" className="text-left hover:cursor-pointer">
              130. Malay - Malaysia
            </option>
            <option value="mt-MT" className="text-left hover:cursor-pointer">
              131. Maltese
            </option>
            <option value="my-MM" className="text-left hover:cursor-pointer">
              132. Burmese
            </option>
            <option value="nb-NO" className="text-left hover:cursor-pointer">
              133. Norwegian (Bokmål)
            </option>
            <option value="ne-IN" className="text-left hover:cursor-pointer">
              134. Nepali - India
            </option>
            <option value="ne-NP" className="text-left hover:cursor-pointer">
              135. Nepali
            </option>
            <option value="nl-BE" className="text-left hover:cursor-pointer">
              136. Dutch - Belgium
            </option>
            <option value="nl-NL" className="text-left hover:cursor-pointer">
              137. Dutch - Netherlands
            </option>
            <option value="nn-NO" className="text-left hover:cursor-pointer">
              138. Norwegian (Nynorsk)
            </option>
            <option value="or-IN" className="text-left hover:cursor-pointer">
              139. Odia
            </option>
            <option value="pa-IN" className="text-left hover:cursor-pointer">
              140. Punjabi
            </option>
            <option value="pa-PK" className="text-left hover:cursor-pointer">
              141. Punjabi (Pakistan)
            </option>
            <option value="pl-PL" className="text-left hover:cursor-pointer">
              142. Polish
            </option>
            <option value="ps-AF" className="text-left hover:cursor-pointer">
              143. Pashto
            </option>
            <option value="pt-BR" className="text-left hover:cursor-pointer">
              144. Portuguese - Brazil
            </option>
            <option value="pt-PT" className="text-left hover:cursor-pointer">
              145. Portuguese - Portugal
            </option>
            <option value="rm-CH" className="text-left hover:cursor-pointer">
              146. Rhaeto-Romanic
            </option>
            <option value="ro-MD" className="text-left hover:cursor-pointer">
              147. Romanian - Moldova
            </option>
            <option value="ro-RO" className="text-left hover:cursor-pointer">
              148. Romanian
            </option>
            <option value="ru-MD" className="text-left hover:cursor-pointer">
              149. Russian - Moldava
            </option>
            <option value="ru-RU" className="text-left hover:cursor-pointer">
              150. Russian
            </option>
            <option value="sa-IN" className="text-left hover:cursor-pointer">
              151. Sanskrit
            </option>
            <option value="sd-IN" className="text-left hover:cursor-pointer">
              152. Sindhi - India
            </option>
            <option value="sd-PK" className="text-left hover:cursor-pointer">
              153. Sindhi - Pakistan
            </option>
            <option value="se-NO" className="text-left hover:cursor-pointer">
              154. Sami
            </option>
            <option value="si-LK" className="text-left hover:cursor-pointer">
              155. Sinhalese - Sri Lanka
            </option>
            <option value="sk-SK" className="text-left hover:cursor-pointer">
              156. Slovak
            </option>
            <option value="sl-SI" className="text-left hover:cursor-pointer">
              157. Slovenian
            </option>
            <option value="so-SO" className="text-left hover:cursor-pointer">
              158. Somali
            </option>
            <option value="sq-AL" className="text-left hover:cursor-pointer">
              159. Albanian - Albania
            </option>
            <option value="st-ZA" className="text-left hover:cursor-pointer">
              160. Sutu
            </option>
            <option value="sv-FI" className="text-left hover:cursor-pointer">
              161. Swedish - Finland
            </option>
            <option value="sv-SE" className="text-left hover:cursor-pointer">
              162. Swedish
            </option>
            <option value="sw-KE" className="text-left hover:cursor-pointer">
              163. Swahili
            </option>
            <option value="ta-IN" className="text-left hover:cursor-pointer">
              164. Tamil
            </option>
            <option value="te-IN" className="text-left hover:cursor-pointer">
              165. Telugu
            </option>
            <option value="th-TH" className="text-left hover:cursor-pointer">
              166. Thai
            </option>
            <option value="ti-ER" className="text-left hover:cursor-pointer">
              167. Tigrigna - Ethiopia
            </option>
            <option value="ti-ET" className="text-left hover:cursor-pointer">
              168. Tigrigna - Eritrea
            </option>
            <option value="tk-TM" className="text-left hover:cursor-pointer">
              169. Turkmen
            </option>
            <option value="tmz" className="text-left hover:cursor-pointer">
              170. Tamazight (Arabic)
            </option>
            <option value="tn-ZA" className="text-left hover:cursor-pointer">
              171. Tswana
            </option>
            <option value="tr-TR" className="text-left hover:cursor-pointer">
              172. Turkish
            </option>
            <option value="ts-ZA" className="text-left hover:cursor-pointer">
              173. Tsonga
            </option>
            <option value="tt-RU" className="text-left hover:cursor-pointer">
              174. Tatar
            </option>
            <option value="uk-UA" className="text-left hover:cursor-pointer">
              175. Ukrainian
            </option>
            <option value="ur-IN" className="text-left hover:cursor-pointer">
              176. Urdu - India
            </option>
            <option value="ur-PK" className="text-left hover:cursor-pointer">
              177. Urdu - Pakistan
            </option>
            <option value="vi-VN" className="text-left hover:cursor-pointer">
              178. Vietnamese
            </option>
            <option value="xh-ZA" className="text-left hover:cursor-pointer">
              179. Xhosa
            </option>
            <option value="yi" className="text-left hover:cursor-pointer">
              180. Yiddish
            </option>
            <option value="yo-NG" className="text-left hover:cursor-pointer">
              181. Yoruba
            </option>
            <option value="zh-CN" className="text-left hover:cursor-pointer">
              182. Chinese - People's Republic of China
            </option>
            <option value="zh-HK" className="text-left hover:cursor-pointer">
              183. Chinese - Hong Kong SAR
            </option>
            <option value="zh-MO" className="text-left hover:cursor-pointer">
              184. Chinese - Macao SAR
            </option>
            <option value="zh-SG" className="text-left hover:cursor-pointer">
              185. Chinese - Singapore
            </option>
            <option value="zh-TW" className="text-left hover:cursor-pointer">
              186. Chinese - Taiwan
            </option>
            <option value="zu-ZA" className="text-left hover:cursor-pointer">
              187. Zulu
            </option>
          </select>
        </div>
        <div className="mt-10 space-y-10 sm:space-y-0 sm:space-x-10 flex sm:flex-row flex-col">
          <button
            className="bg-slate-100 px-3 py-1 border border-black rounded-xl"
            onClick={handleUpload}
          >
            Upload
          </button>
          <button
            onClick={translateFile}
            className="bg-slate-100 px-3 py-1 border border-black rounded-xl"
          >
            Translate
          </button>
          <button
            className="bg-slate-100 px-3 py-1 border border-black rounded-xl"
            onClick={download}
          >
            Download
          </button>
        </div>
        <button
          className="bg-slate-100 px-3 py-1 border border-black rounded-xl mt-10"
          onClick={xliffDownload}
        >
          Xliff Download
        </button>
      </div>

      <Xliff2Text />
    </div>
  );
};

export default TranslateDev;
