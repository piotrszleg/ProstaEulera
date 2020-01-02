import markdown
from markdown.extensions import Extension
from markdown.treeprocessors import Treeprocessor
import codecs
import re
import sys
import time

# rebuilds webpage from sources listed below
# replacing include statements with file contents and adding markdown

template="template.html"
content="content.html"
output="index.html"

# file related helper functions
def checkSame(file_name, text):
	file = codecs.open(file_name, mode="r", encoding="utf-8")
	return file.read()==text

def read(file_name):
	file = codecs.open(file_name, mode="r", encoding="utf-8")
	return file.read()

def write(file_name, text):
	file = codecs.open(file_name, "w", 
                          encoding="utf-8", 
                          errors="xmlcharrefreplace"
	)
	file.write(text)

# will detect:
# include "file"
# and 
# include-md "file" 
# and replace it with file contents
def includes(text):
	output="";
	for line in text.splitlines():
		match=re.match( r'\s*include\s?"(.+)"\s*', line, re.I)
		md_match=re.match( r'\s*include-md\s?"(.+)"\s*', line, re.I)
		if match:
			output+=read(match.group(1))+'\n'
		elif md_match:
			output+=markdown.markdown(read(md_match.group(1))+'\n', extensions=['markdown.extensions.toc', MDBExtension()])#'outline', 
		else:
			output+=line
	return output

# MDB styling markdown Extension
class MDBTreeprocessor(Treeprocessor):
    def __init__(self, md):
        super(MDBTreeprocessor, self).__init__(md)

    def run(self, doc):
        for el in doc.iter():
            if re.match( r'h\d', el.tag):
            	el.attrib["class"]='font-weight-bold'

class MDBExtension(Extension):
   def extendMarkdown(self, md, md_globals):
       md.treeprocessors["MDB"]=MDBTreeprocessor(md)

# execute
if __name__ == "__main__":
	# calling with '-auto' flag will make it rebuild every time one of the files changes
	if len(sys.argv)>1 and sys.argv[1]=="-auto":
		print("Listening for changes:")
		template_last=read(template)
		content_last=read(content)
		while True:
			if not (checkSame(template, template_last) and checkSame(content, content_last)):
				write(output, includes(read(template)))
				template_last=read(template)
				content_last=read(content)
				print("building at: "+time.strftime("%H:%M:%S", time.gmtime(time.time()-time.altzone)))
			time.sleep(1)
	else:
		# normal, one time build
		write(output, includes(read(template)))