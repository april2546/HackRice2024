// scrapes course titles, names, and credit hours 
// from a search result using the rice course catalog: https://courses.rice.edu/courses/!SWKSCAT.cat?p_action=cata 
// on line 37: std::string html_document = get_request(INSERT_DOMAIN_HERE);
#include <iostream>
#include <fstream>
#include <vector>
#include "curl/curl.h"
#include "libxml/HTMLparser.h"
#include "libxml/xpath.h"

struct course {
    std::string title,
                name,
                credit_hours;
};

static size_t write_callback(void *contents, size_t size, size_t nmemb, void *userp) {
    ((std::string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

std::string get_request(std::string url) {
    CURL* curl;
    CURLcode res;
    std::string htmlContent;
    curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &htmlContent);
        res = curl_easy_perform(curl);
        if(res != CURLE_OK)
            std::cerr << "curl_easy_perform() failed: " << curl_easy_strerror(res) << std::endl;
        curl_easy_cleanup(curl);
    }
    return htmlContent;
}

std::vector<course> parse_HTML(const std::string& htmlContent) {
    std::vector<course> courses;
    htmlDocPtr doc = htmlReadMemory(htmlContent.c_str(), htmlContent.size(), NULL, NULL, HTML_PARSE_NOERROR | HTML_PARSE_NOWARNING);
    if(doc == NULL) {
        std::cerr << "Error parsing HTML content" << std::endl;
        return courses;
    }

    xmlXPathContextPtr xpathCtx = xmlXPathNewContext(doc);
    if(xpathCtx == NULL) {
        std::cerr << "Error creating XPath context" << std::endl;
        xmlFreeDoc(doc);
        return courses;
    }

    xmlXPathObjectPtr xpathObj = xmlXPathEvalExpression((xmlChar*)"//tr[contains(@class, 'even') or contains(@class, 'odd')]", xpathCtx);
    if(xpathObj == NULL) {
        std::cerr << "Error evaluating XPath expression" << std::endl;
        xmlXPathFreeContext(xpathCtx);
        xmlFreeDoc(doc);
        return courses;
    }
    xmlNodeSetPtr nodes = xpathObj->nodesetval;


    return courses;
}

int main() {
    curl_global_init(CURL_GLOBAL_ALL); // initialize curl globally
    std::string html_document = get_request("https://courses.rice.edu/courses/!SWKSCAT.cat?p_acyr_code=2025&p_action=CATASRCH&p_onebar=&p_mode=AND&p_subj_cd=&p_subj=&p_dept=&p_school=&p_df=GRP1&p_submit=&as_fid=f0071ef8b7d71a9106c5f903e7d8185a33b54f44"); // target page
    htmlDocPtr doc = htmlReadMemory(html_document.c_str(), html_document.length(), NULL, NULL, HTML_PARSE_NOERROR); // parse html
    xmlXPathContextPtr context = xmlXPathNewContext(doc); // initialize the XPath context for libxml2

    // get the course elementss
    xmlXPathObjectPtr title_html_elements = xmlXPathEvalExpression((xmlChar *) "//tr/td[contains(@class, 'cataCourse')]", context);
    xmlXPathObjectPtr name_html_elements = xmlXPathEvalExpression((xmlChar *) "//tr/td[contains(@class, 'cataTitle')]", context);
    xmlXPathObjectPtr credit_hours_html_element = xmlXPathEvalExpression((xmlChar *) "//td[contains(@class, 'credits')]", context);

    std::vector<course> courses; // vector to store the scraped courses
    
    // iterate over html elements
    for(int i = 0; i < title_html_elements->nodesetval->nodeNr; i++) {
        xmlNodePtr title_html_element = title_html_elements->nodesetval->nodeTab[i];
        xmlNodePtr name_html_element = name_html_elements->nodesetval->nodeTab[i];
        xmlNodePtr credit_hours_element = credit_hours_html_element->nodesetval->nodeTab[i];

        // check if each element is null, if null set N/A
        std::string title = title_html_element ? 
            std::string(reinterpret_cast<char *>(xmlNodeGetContent(title_html_element))) : "N/A";

        std::string name = name_html_element ? 
            std::string(reinterpret_cast<char *>(xmlNodeGetContent(name_html_element))) : "N/A";

        std::string credit_hours = credit_hours_element ? 
            std::string(reinterpret_cast<char *>(xmlNodeGetContent(credit_hours_element))) : "N/A";
    
        course c = {title, name, credit_hours}; // create new course w/ elements
        courses.push_back(c); // push into course vector
    }
    xmlXPathFreeContext(context);

    xmlFreeDoc(doc);

    std::ofstream txt_file("courses.txt"); // create csv file
    txt_file << "\"title\",\"name\",\"credit_hours\"\\" << std::endl; // csv header
    for(const auto& c : courses) { // iterate through course vector and write to csv
        txt_file << "\"" << c.title << "\",\"" << c.name << "\",\"" << c.credit_hours << "\"\\" << std::endl;
    }
    txt_file.close();
    curl_global_cleanup();
    return 0;
}