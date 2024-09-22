#include <iostream>
#include <fstream>
#include "curl/curl.h"
#include "libxml/HTMLparser.h"
#include "libxml/xpath.h"
#include <vector>
#include <string>

struct course {
    std::string code,
                title,
                hours;
};

static size_t write_callback(void* contents, size_t size, size_t nmemb, std::string* s) {
    size_t totalSize = size * nmemb;
    s->append((char*)contents, totalSize);
    return totalSize;
}

std::string fetch_HTML(const std::string& url) {
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

    course c;
    int column = 0; // keeps track of where we are
    xmlNodeSetPtr nodes = xpathObj->nodesetval;
    for(int i = 0; i < nodes->nodeNr; ++i) {
        xmlNodePtr node = nodes->nodeTab[i];
        xmlChar* content = xmlNodeGetContent(node);

        switch(column) {
            case 0:  // if colspan is 2, this row has no hours (its a header)
                if (xmlGetProp(node, (xmlChar*)"colspan") != NULL) {
                    column = 2;
                } else {
                    c.code = (const char*)content;
                }
                break;
            case 1:  // get title
                c.title = (const char*)content;
                break;
            case 2:  // get credit hours
                c.hours = (const char*)content;
                courses.push_back(c);
                c = course();  // Reset for the next row
                break;
        }
        xmlFree(content);
        column = (column + 1) % 3;
    }
    xmlXPathFreeObject(xpathObj);
    xmlXPathFreeContext(xpathCtx);
    xmlFreeDoc(doc);
    return courses;
}

void write_to_txt(const std::string& filename, const std::vector<course>& courses) {
    std::ofstream file(filename);
    if (!file.is_open()) {
        std::cerr << "Error opening file for writing: " << filename << std::endl;
        return;
    }
    for (const auto& course : courses) {
        file << course.code << "," << course.title << ",\\\n" << course.hours << " \\\n";
    }
    file.close();
}

int main() {
    // from a course under the "Departments and Programs" 
    // select a program -> undergrad -> select major -> paste
    const std::string url = "https://ga.rice.edu/programs-study/departments-programs/engineering/computer-science/computer-science-bscs/#requirementstext";  // Replace with actual URL
    const std::string txtFile = "courses.txt";
    std::string htmlContent = fetch_HTML(url);
    std::vector<course> courses = parse_HTML(htmlContent);
    write_to_txt(txtFile, courses);
    // std::cout << "Course data written to " << txtFile << std::endl; 
    return 0;
}
