import tkinter as tk
from Quartz import CGDisplayHideCursor
import Quartz
import subprocess
import smtplib
import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import AppKit

password = ''
# import password
try:
    file = open('/Users/aaitouna/.password', 'r')
    password = file.readline()
    file.close()
except:
    print("failed to get password from file : .password")
    exit()

# initializing email stuff
sender = "aitounaayoub05@gmail.com"
receiver = sender

def script_started(duration):
    duration /= (60 * 60 * 1000)
    message = MIMEMultipart()
    message["from"] = "Python script"
    message["to"] = receiver
    message["subject"] = "Script started"
    current_time = datetime.datetime.now()
    formatted_time = current_time.strftime("%Y-%m-%d %H:%M:%S")
    message.attach(MIMEText("Script started on : " + formatted_time + " and set for : " + str(int(duration)) + " hours."))
    with smtplib.SMTP(host="smtp.gmail.com", port=587) as smtp:
        smtp.ehlo()
        smtp.starttls()
        try:
            smtp.login(sender, password)
            smtp.send_message(message)
        except:
            print("failed to send email, stopping the script")
            restore_dock()
            exit()

def lock_screen(msg):
    # add current time screen was locked
    subprocess.run(["pmset", "displaysleepnow"])
    message = MIMEMultipart()
    message["from"] = "Python script"
    message["to"] = receiver
    message["subject"] = "Your session has been locked"
    current_time = datetime.datetime.now()
    formatted_time = current_time.strftime("%Y-%m-%d %H:%M:%S")
    message.attach(MIMEText("Your session has been locked on : " + formatted_time + " due to : " + str(msg)))
    message["subject"] = "Your session has been locked"
    # sending the message 
    with smtplib.SMTP(host="smtp.gmail.com", port=587) as smtp:
        smtp.ehlo()
        smtp.starttls()
        try:
            smtp.login(sender, password)
            smtp.send_message(message)
        except:
             print("failed to send email")

def kill_dock():
    command = ['defaults', 'write', 'com.apple.Dock', 'autohide-delay', '-float', '1000']
    subprocess.run(command)
    subprocess.run(["killall", "Dock"])

def restore_dock():
    command = ['defaults', 'delete', 'com.apple.Dock', 'autohide-delay']
    subprocess.run(command)
    subprocess.run(["killall", "Dock"])

def on_key_press(message=None, event=None):
    if (message is None):
        message="script finished execution"
    lock_screen(message)
    root.quit()
    restore_dock()

def start_caf():
    caffeinate_process = subprocess.Popen(['caffeinate', '-d'])
    if caffeinate_process.poll() is not None:
        print('Failed to keep the screen awake.')
        root.quit()

root = tk.Tk()
duration = 6 # duration in hours
duration = duration * 60 * 60 * 1000
# hide cursor
CGDisplayHideCursor(0)
# kill dock process
kill_dock()
# start caffeinte cmd to prevent screen from sleeping
start_caf()
script_started(duration)
#prevent mouse from moving (disable it)
AppKit.NSEvent.stopPeriodicEvents()
Quartz.CGAssociateMouseAndMouseCursorPosition(False)
# setting up tkinter window
root.grab_set()
root.title('Black Window')
root.geometry("800x600");
root.attributes('-fullscreen', True)
root.configure(bg='black')
root.unbind('<Control-Up>')
# bind all keys : normle keys and hotkeys specified for adjusting brightness and stuff
root.bind_all("<Key>", lambda event : on_key_press("interrupted by someone", event))
root.bind_all("<Button>", lambda event : on_key_press("interrupted by someone", event))
# make first parameter in milliseconds (ex : 3 seconds => 3000)

root.after(duration, on_key_press)
root.mainloop()