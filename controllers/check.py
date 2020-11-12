import nltk
from collections import defaultdict
from nltk.stem.snowball import EnglishStemmer  # Assuming we're working with English
from nltk.stem import PorterStemmer
from nltk.stem import LancasterStemmer
from nltk.tokenize import word_tokenize
import PyPDF2
import data_func
import sys

class Index:


    def __init__(self, tokenizer, stemmer=None, stopwords=None):

        self.tokenizer = tokenizer
        self.stemmer = stemmer
        self.index = defaultdict(list)
        self.documents = {}
        self.__unique_id = 0
        if not stopwords:
            self.stopwords = set()
        else:
            self.stopwords = set(stopwords)

    def lookup(self, word):

        word = word.lower()
        if self.stemmer:
            word = self.stemmer.stem(word)

        # for i in self.index.get(word):
        #     print(i[0])
        for id in self.index.get(word):
            return [self.documents.get(id[0], None)]
        # return [self.documents.get(id, None) for id in self.index.get(word)]

    def add(self, document):

        i=0
        for token in [t.lower() for t in nltk.word_tokenize(document)]:
            if token in self.stopwords:
                continue

            if self.stemmer:
                token = self.stemmer.stem(token)

            temp=[]
            if self.__unique_id not in self.index[token]:
                temp.append(self.__unique_id)
                temp.append(i)
                self.index[token].append(temp)
            i=i+1
        self.documents[self.__unique_id] = document
        self.__unique_id += 1

    def find(self):
        # print(self.documents)
        # print("\n")
        print(self.index)

    def getPlag(self):
        count = 0
        count1=0
        count2=0
        for word, index in self.index.items():
            # print(word, ':', index)
            temp=index[0][0]
            for i in index:
                if(i[0]!=temp):
                    temp=i[0]
                    count=count+1
                if(i[0]==0):
                    count1=count1+1
                else:
                    count2=count2+1
        return [count/count1, count/count2, count]


index = Index(nltk.word_tokenize,
              EnglishStemmer(),
              nltk.corpus.stopwords.words('english'))



for i in range(1,3):
    #COnverting .pdf file to .txt file
    # reader = PyPDF2.PdfFileReader('E:/C/Python/IWP Project/test'+str(i)+'.pdf')
    # text = data_func.convert_pdf_to_string('E:/C/Python/IWP Project/test'+str(i)+'.pdf')
    # text_file = open('E:/C/Python/IWP Project/test'+str(i)+'.txt', 'w')
    # n = text_file.write(text)
    # text_file.close()

    # file = open('E:/C/Python/IWP Project/test'+str(i)+'.txt')
    # read = file.read()
    # file.seek(0)
    read=sys.argv[i];
    punc = '''!()-[]{};:'"\, <>./?@#$%^&*_~'''
    for ele in read:
        if ele in punc:
            read = read.replace(ele, " ")
    # print(read)
    index.add(read)

# index.find()

l=index.getPlag()
print("Document 1 is {0:.0f}% plagarised,".format(l[0]*100))
print("Document 2 is {0:.0f}% plagarised,".format(l[1]*100))
print("{0:d} similar words,".format(l[2]))


# print(sys.argv[1])
# print(dataToSendBack)
# sys.stdout.flush()





















# index.add('Industrial Disease')
# index.add('Private Investigations')
# index.add('So Far Away')
# index.add('Twisting by the Pool')
# index.add('Skateaway')
# index.add('Walk of Life')
# index.add('Romeo and Juliet')
# index.add('Tunnel of Love')
# index.add('Money for Nothing')
# index.add('Sultans of Swing')
#
# index.add('Stairway To Heaven')
# index.add('Kashmir')
# index.add('Achilles Last Stand')
# index.add('Whole Lotta Love')
# index.add('Immigrant Song')
# index.add('Black Dog')
# index.add('When The Levee Breaks')
# index.add('Since I\'ve Been Lovin\' You')
# index.add('Since I\'ve Been Loving You')
# index.add('Over the Hills and Far Away')
# index.add('Dazed and Confused')

# print(index.lookup('loves'))
# # ['Tunnel of Love', 'Whole Lotta Love', "Since I've Been Loving You"]
#
# print(index.lookup('loved'))
# # ['Tunnel of Love', 'Whole Lotta Love', "Since I've Been Loving You"]
#
# print(index.lookup('daze'))
# # ['Dazed and Confused']
#
# print(index.lookup('confusion'))
# # ['Dazed and Confused']


# l=index.documents
# def lookit(l, word):
#     c=0
#     word=word.lower()
#     ps=PorterStemmer()
#     word=ps.stem(word)
#     # print(word)
#     for x in (l.values()):
#         if word.lower() in x.lower():
#             # print(word.lower())
#             print("Id: ", c, " Content :",x)
#         c+=1
# lookit(l, "loved")
# lookit(l, "daze")


# porter = PorterStemmer()
# lancaster = LancasterStemmer()
# word_list=["program", "programming", "programmer"]
# print("{0:20}{1:20}{2:20}".format("Word", "Porter stemmer", "lancaster stemmer"))
# for word in word_list:
#     print("{0:20}{1:20}{2:20}".format(word, porter.stem(word), lancaster.stem(word)))
