CXX = g++
CXXFLAGS = -std=c++11 -Wall
LIBS = -lcurl -lxml2
INCLUDES = -I/usr/include/libxml2

TARGET = main
SRCS = requirement_scraper.cpp
OBJS = $(SRCS:.cpp=.o)

all: $(TARGET)
$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) $(OBJS) -o $(TARGET) $(LIBS)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET)

run: $(TARGET)
	./$(TARGET)

rebuild: clean all
